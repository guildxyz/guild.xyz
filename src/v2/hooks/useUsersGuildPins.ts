import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { consts } from "@guildxyz/types"
import useUser from "components/[guild]/hooks/useUser"
import guildPinAbi from "static/abis/guildPin"
import useSWRImmutable from "swr/immutable"
import { GuildPinMetadata, User } from "types"
import base64ToObject from "utils/base64ToObject"
import { GuildPinsSupportedChain } from "utils/guildCheckout/constants"
import ipfsToGuildGateway from "utils/ipfsToGuildGateway"
import {
  http,
  PublicClient,
  type Chain as ViemChain,
  createPublicClient,
} from "viem"
import { wagmiConfig } from "wagmiConfig"
import { Chains } from "wagmiConfig/chains"

const getUsersGuildPinIdsOnChain = async (
  balance: bigint,
  chain: GuildPinsSupportedChain,
  address: `0x${string}`,
  client: PublicClient
) => {
  const contracts = Array.from({ length: Number(balance) }, (_, i) => ({
    abi: guildPinAbi,
    address: consts.PinContractAddresses[chain],
    functionName: "tokenOfOwnerByIndex",
    args: [address, BigInt(i)],
  }))

  const results =
    contracts.length > 0
      ? /**
         * We need to @ts-ignore this line, since we get a "Type instantiation is
         * excessively deep and possibly infinite" error here until strictNullChecks is set
         * to false in our tsconfig. We should set it to true & sort out the related issues
         * in another PR.
         */
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await client.multicall({
          contracts,
        })
      : []

  const errors: Error[] = results
    .filter((result) => result.status === "failure")
    .map((result) => result.error)

  const pinIds = results
    .filter((result) => result.status === "success")
    .map((result) => result.result as bigint)

  return { pinIds, errors }
}

type TokenInfo = {
  chainId: Chains
  tokenId: number
  tokenUri: string
}

const getPinTokenURIsForPinIds = async (
  pinIds: bigint[],
  chain: GuildPinsSupportedChain,
  client: PublicClient
) => {
  const contractCalls = pinIds.map((tokenId) => ({
    abi: guildPinAbi,
    address: consts.PinContractAddresses[chain],
    functionName: "tokenURI",
    args: [tokenId],
  }))

  const results =
    contractCalls.length > 0
      ? await client.multicall({
          /**
           * We need to @ts-ignore this line, since we get a "Type instantiation is
           * excessively deep and possibly infinite" error here until
           * strictNullChecks is set to false in our tsconfig. We should set it to
           * true & sort out the related issues in another PR.
           */
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          contracts: contractCalls,
        })
      : []

  const tokenInfo: TokenInfo[] = results.map((result, index) => ({
    chainId: Chains[chain],
    tokenId: Number(pinIds[index]),
    tokenUri: result.status === "success" ? (result.result as string) : null,
  }))

  const errors: Error[] = results
    .filter((res) => res.status === "failure")
    .map((res) => res.error)

  return { tokenInfo, errors }
}

type TokenWithMetadata = {
  chainId: Chains
  tokenId: number
} & GuildPinMetadata

const getTokenWithMetadata = (tokenInfo: {
  chainId: Chains
  tokenId: number
  tokenUri: string
}): TokenWithMetadata => {
  const { chainId, tokenId, tokenUri } = tokenInfo

  const metadata: GuildPinMetadata = base64ToObject<GuildPinMetadata>(tokenUri)

  if (!metadata) return null

  return {
    ...metadata,
    chainId,
    tokenId,
    image: ipfsToGuildGateway(metadata.image),
  }
}

const fetchGuildPinsOnChain = async (
  address: `0x${string}`,
  chain: GuildPinsSupportedChain
) => {
  const publicClient = createPublicClient({
    chain: wagmiConfig.chains.find((c) => Chains[c.id] === chain) as ViemChain,
    transport: http(),
  })

  let balance = null
  try {
    balance = await publicClient.readContract({
      abi: guildPinAbi,
      address: consts.PinContractAddresses[chain],
      functionName: "balanceOf",
      args: [address],
    })
  } catch (e) {
    return { jsonMetadata: [], errors: [e] as Error[] }
  }

  const { pinIds, errors: pinIdFetchErrors } = await getUsersGuildPinIdsOnChain(
    balance,
    chain,
    address,
    // We shouldn't cast here once we set strictNullChecks to true
    publicClient as PublicClient
  )

  const { tokenInfo, errors: tokenURIFetchErrors } = await getPinTokenURIsForPinIds(
    pinIds,
    chain,
    // We shouldn't cast here once we set strictNullChecks to true
    publicClient as PublicClient
  )

  const { tokenMetadata, errors: metadataTransformationErrors } = tokenInfo.reduce(
    (acc, token) => {
      const metadata = getTokenWithMetadata(token)
      if (!metadata) {
        const error: Error = {
          message: `Failed to transform tokenURI: ${token}`,
          name: "tokenMetadataTransformError",
        }
        acc.errors.push(error)
      } else {
        acc.tokenMetadata.push(metadata)
      }
      return acc
    },
    { tokenMetadata: [] as TokenWithMetadata[], errors: [] as Error[] }
  )

  const errors = [
    ...pinIdFetchErrors,
    ...tokenURIFetchErrors,
    ...metadataTransformationErrors,
  ]
  return { tokenMetadata, errors }
}

const fetchGuildPins = async ([_, addresses, includeTestnets]: [
  string,
  User["addresses"],
  boolean,
]) => {
  const TESTNET_KEYS: GuildPinsSupportedChain[] = ["SEPOLIA"]
  const guildPinChains = Object.keys(consts.PinContractAddresses).filter((key) =>
    includeTestnets ? true : !TESTNET_KEYS.includes(key as GuildPinsSupportedChain)
  ) as GuildPinsSupportedChain[]

  const responseArray = await Promise.all(
    guildPinChains.flatMap((chain) =>
      addresses.flatMap((addressData) =>
        fetchGuildPinsOnChain(addressData?.address, chain)
      )
    )
  )

  const { allUsersPins, allErrors } = responseArray.reduce(
    (acc, response) => {
      if (response.tokenMetadata) {
        acc.allUsersPins.push(...response.tokenMetadata)
      }
      if (response?.errors.length > 0) {
        acc.allErrors.push(...response.errors)
      }
      return acc
    },
    { allUsersPins: [] as TokenWithMetadata[], allErrors: [] as Error[] }
  )

  return { usersPins: allUsersPins, errors: allErrors }
}

const useUsersGuildPins = (disabled = false, includeTestnets = false) => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const { addresses } = useUser()

  const evmAddresses = addresses?.filter((address) => address.walletType === "EVM")

  const shouldFetch = Boolean(!disabled && isWeb3Connected && evmAddresses?.length)

  const swrData = useSWRImmutable(
    shouldFetch ? ["guildPins", evmAddresses, includeTestnets] : null,
    fetchGuildPins
  )

  return {
    ...swrData,
    data: swrData.data?.usersPins,
    error: swrData.data?.errors?.length > 0,
  }
}

export default useUsersGuildPins
