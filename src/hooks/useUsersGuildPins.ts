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
  const contracts = []

  for (let i = 0; i < balance; i++) {
    contracts.push({
      abi: GUILD_PIN_CONTRACTS[chain].abi,
      address: GUILD_PIN_CONTRACTS[chain].address,
      functionName: "tokenOfOwnerByIndex",
      args: [address, BigInt(i)],
    })
  }

  const results =
    contracts.length === 0
      ? []
      : await client.multicall({
          contracts: contracts,
        })

  const errors: Error[] = results
    .filter((result) => result.status === "failure")
    .map((result) => result.error)

  const pinIds: bigint[] = results
    .filter((result) => result.status === "success")
    .map((result) => result.result as bigint)

  return { pinIds, errors }
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
    contractCalls.length === 0
      ? []
      : await client.multicall({
          contracts: contractCalls,
        })

  const tokenURIs = results.map((result, index) => ({
    chainId: Chains[chain],
    tokenId: Number(pinIds[index]),
    tokenUri: result.status === "success" ? result.result : null,
  }))

  const errors: Error[] = results
    .filter((res) => res.status === "failure")
    .map((res) => res.error)

  return { tokenURIs, errors }
}

const tokenURItoMetadataJSON = (tokenURI: {
  chainId: Chains
  tokenId: number
  tokenUri: unknown
}) => {
  const { chainId, tokenId, tokenUri } = tokenURI

  const metadata: GuildPinMetadata = base64ToObject<GuildPinMetadata>(
    tokenUri as string
  )

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
    return { usersPinsMetadataJSONs: [], errors: [{ error: e, status: "failure" }] }
  }

  const { pinIds, errors: pinIdFetchErrors } = await getUsersGuildPinIdsOnChain(
    balance,
    chain,
    address,
    publicClient
  )

  const { tokenURIs, errors: tokenURIFetchErrors } = await getPinTokenURIsForPinIds(
    pinIds,
    chain,
    publicClient
  )
  const usersPinsMetadataJSONs = tokenURIs.map((tokenURI) =>
    tokenURItoMetadataJSON(tokenURI)
  )

  const errors = [...pinIdFetchErrors, ...tokenURIFetchErrors]
  return { usersPinsMetadataJSONs, errors }
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
      if (response.usersPinsMetadataJSONs) {
        acc.allUsersPins.push(...response.usersPinsMetadataJSONs)
      }
      if (response?.errors.length > 0) {
        acc.allErrors.push(...response.errors)
      }
      return acc
    },
    { allUsersPins: [], allErrors: [] }
  )

  return { usersPins: allUsersPins, errors: allErrors }
}

const useUsersGuildPins = (disabled = false, includeTestnets = false) => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const { addresses } = useUser()

  const evmAddresses = addresses?.filter((address) => address.walletType === "EVM")

  const shouldFetch = Boolean(!disabled && isWeb3Connected && evmAddresses?.length)

  const swrData = useSWRImmutable(
    shouldFetch ? ["guildPins", addresses, includeTestnets] : null,
    fetchGuildPins
  )

  return {
    ...swrData,
    data: swrData.data?.usersPins,
    pinFetchErrors: swrData.data?.errors,
  }
}

export default useUsersGuildPins
