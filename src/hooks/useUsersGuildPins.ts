import { CHAIN_CONFIG, Chains } from "chains"
import useUser from "components/[guild]/hooks/useUser"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import useSWRImmutable from "swr/immutable"
import { GuildPinMetadata, User } from "types"
import base64ToObject from "utils/base64ToObject"
import {
  GUILD_PIN_CONTRACTS,
  GuildPinsSupportedChain,
} from "utils/guildCheckout/constants"
import { PublicClient, createPublicClient, http } from "viem"

const getUsersGuildPinIdsOnChain = async (
  balance: bigint,
  chain: GuildPinsSupportedChain,
  address: `0x${string}`,
  client: PublicClient
) => {
  const contracts = Array.from({ length: Number(balance) }, (_, i) => ({
    abi: GUILD_PIN_CONTRACTS[chain].abi,
    address: GUILD_PIN_CONTRACTS[chain].address,
    functionName: "tokenOfOwnerByIndex",
    args: [address, BigInt(i)],
  }))

  const results =
    contracts.length > 0
      ? // WAGMI TODO: don't know why we get this error here, had to ts-ignore it unfortunately...
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
    abi: GUILD_PIN_CONTRACTS[chain].abi,
    address: GUILD_PIN_CONTRACTS[chain].address,
    functionName: "tokenURI",
    args: [tokenId],
  }))

  const results =
    contractCalls.length > 0
      ? await client.multicall({
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
    image: metadata.image.replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_GATEWAY),
  }
}

const fetchGuildPinsOnChain = async (
  address: `0x${string}`,
  chain: GuildPinsSupportedChain
) => {
  const publicClient = createPublicClient({
    chain: CHAIN_CONFIG[chain],
    transport: http(),
  })

  let balance = null
  try {
    balance = await publicClient.readContract({
      abi: GUILD_PIN_CONTRACTS[chain].abi,
      address: GUILD_PIN_CONTRACTS[chain].address,
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
    publicClient
  )

  const { tokenInfo, errors: tokenURIFetchErrors } = await getPinTokenURIsForPinIds(
    pinIds,
    chain,
    publicClient
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
  boolean
]) => {
  const TESTNET_KEYS: GuildPinsSupportedChain[] = ["POLYGON_MUMBAI"]
  const guildPinChains = Object.keys(GUILD_PIN_CONTRACTS).filter((key) =>
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
