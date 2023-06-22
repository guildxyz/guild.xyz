import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useUser from "components/[guild]/hooks/useUser"
import { Chain, Chains, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import { GuildPinMetadata } from "types"
import base64ToObject from "utils/base64ToObject"
import { flattenedGuildPinChainsData } from "utils/guildCheckout/constants"

const fetchGuildPinsOnChain = async (address: string, chain: Chain) => {
  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0])
  const contract = new Contract(
    flattenedGuildPinChainsData[chain].address,
    flattenedGuildPinChainsData[chain].abi,
    provider
  )

  const usersGuildPinIdsOnChain: BigNumber[] = []

  const balance = await contract.balanceOf(address)

  for (let i = 0; i < balance; i++) {
    const newTokenId = await contract.tokenOfOwnerByIndex(address, i)
    if (newTokenId) usersGuildPinIdsOnChain.push(newTokenId)
  }

  const usersGuildPinTokenURIsOnChain = await Promise.all<{
    chainId: number
    tokenId: number
    tokenUri: string
  }>(
    usersGuildPinIdsOnChain.map(async (tokenId) => {
      const tokenUri: string = await contract.tokenURI(tokenId)
      return {
        chainId: Chains[chain],
        tokenId: tokenId.toNumber(),
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

const fetchGuildPins = async ([_, addresses]) => {
  const guildPinChains = Object.keys(flattenedGuildPinChainsData) as Chain[]
  const responseArray = await Promise.all(
    guildPinChains.flatMap((chain) =>
      addresses.flatMap((address) => fetchGuildPinsOnChain(address, chain))
    )
  )

  return responseArray.flat()
}

const useUsersGuildPins = (disabled = false) => {
  const { isActive } = useWeb3React()
  const { addresses } = useUser()

  const shouldFetch = Boolean(!disabled && isActive && addresses?.length)

  return useSWRImmutable<
    ({ chainId: number; tokenId: number } & GuildPinMetadata)[]
  >(shouldFetch ? ["guildPins", addresses] : null, fetchGuildPins)
}

export default useUsersGuildPins
