import useUser from "components/[guild]/hooks/useUser"
import { CHAIN_CONFIG, Chains } from "connectors"
import useSWRImmutable from "swr/immutable"
import { GuildPinMetadata, User } from "types"
import base64ToObject from "utils/base64ToObject"
import {
  GUILD_PIN_CONTRACTS,
  GuildPinsSupportedChain,
} from "utils/guildCheckout/constants"
import { createPublicClient, http } from "viem"
import { useAccount } from "wagmi"

const fetchGuildPinsOnChain = async (
  address: `0x${string}`,
  chain: GuildPinsSupportedChain
) => {
  const publicClient = createPublicClient({
    chain: CHAIN_CONFIG[chain],
    transport: http(),
  })

  const usersGuildPinIdsOnChain: bigint[] = []

  const balance = await publicClient.readContract({
    abi: GUILD_PIN_CONTRACTS[chain].abi,
    address: GUILD_PIN_CONTRACTS[chain].address,
    functionName: "balanceOf",
    args: [address],
  })

  for (let i = 0; i < balance; i++) {
    const newTokenId = await publicClient.readContract({
      abi: GUILD_PIN_CONTRACTS[chain].abi,
      address: GUILD_PIN_CONTRACTS[chain].address,
      functionName: "tokenOfOwnerByIndex",
      args: [address, BigInt(i)],
    })

    if (newTokenId) usersGuildPinIdsOnChain.push(newTokenId)
  }

  const usersGuildPinTokenURIsOnChain = await Promise.all<{
    chainId: number
    tokenId: number
    tokenUri: string
  }>(
    usersGuildPinIdsOnChain.map(async (tokenId) => {
      const tokenUri = await publicClient.readContract({
        abi: GUILD_PIN_CONTRACTS[chain].abi,
        address: GUILD_PIN_CONTRACTS[chain].address,
        functionName: "tokenURI",
        args: [tokenId],
      })

      return {
        chainId: Chains[chain],
        tokenId: Number(tokenId),
        tokenUri,
      }
    })
  )

  const usersPinsMetadataJSONs = await Promise.all(
    usersGuildPinTokenURIsOnChain.map(async ({ chainId, tokenId, tokenUri }) => {
      const metadata: GuildPinMetadata = base64ToObject<GuildPinMetadata>(tokenUri)

      return {
        ...metadata,
        chainId,
        tokenId,
        image: metadata.image.replace(
          "ipfs://",
          process.env.NEXT_PUBLIC_IPFS_GATEWAY
        ),
      }
    })
  )

  return usersPinsMetadataJSONs
}

const fetchGuildPins = async ([_, addresses]: [string, User["addresses"]]) => {
  const guildPinChains = Object.keys(
    GUILD_PIN_CONTRACTS
  ) as GuildPinsSupportedChain[]
  const responseArray = await Promise.all(
    guildPinChains.flatMap((chain) =>
      addresses.flatMap((addressData) =>
        fetchGuildPinsOnChain(addressData?.address, chain)
      )
    )
  )

  return responseArray.flat()
}

const useUsersGuildPins = (disabled = false) => {
  const { isConnected } = useAccount()
  const { addresses } = useUser()

  const shouldFetch = Boolean(!disabled && isConnected && addresses?.length)

  return useSWRImmutable<
    ({ chainId: number; tokenId: number } & GuildPinMetadata)[]
  >(shouldFetch ? ["guildPins", addresses] : null, fetchGuildPins)
}

export default useUsersGuildPins
