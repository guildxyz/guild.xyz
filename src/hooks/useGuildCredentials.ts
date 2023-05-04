import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { Chain, Chains, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import { GuildCredentialMetadata } from "types"
import { GUILD_CREDENTIAL_CONTRACT } from "utils/guildCheckout/constants"

const fetchGuildCredentialsOnChain = async (address: string, chain: Chain) => {
  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0])
  const contract = new Contract(
    GUILD_CREDENTIAL_CONTRACT[chain].address,
    GUILD_CREDENTIAL_CONTRACT[chain].abi,
    provider
  )

  let usersCredentialIdsOnChain: BigNumber[] = []

  try {
    usersCredentialIdsOnChain = await contract.tokensOfOwner(address)
  } catch {
    const balance = await contract.balanceOf(address)

    for (let i = 0; i < balance; i++) {
      const newTokenId = await contract.tokenOfOwnerByIndex(address, i)
      if (newTokenId) usersCredentialIdsOnChain.push(newTokenId)
    }
  }

  // TODO: maybe use multicall here?
  const usersCredentialTokenURIsOnChain = await Promise.all<{
    chainId: number
    tokenId: number
    tokenURI: string
  }>(
    usersCredentialIdsOnChain.map(async (tokenId) => {
      const tokenURI: string = await contract.tokenURI(tokenId)
      return {
        chainId: Chains[chain],
        tokenId: tokenId.toNumber(),
        tokenURI,
      }
    })
  )

  const usersCredentialMetadataJSONs = await Promise.all(
    usersCredentialTokenURIsOnChain.map(async ({ chainId, tokenId, tokenURI }) => {
      const pinataURL = tokenURI.replace(
        "ipfs://",
        process.env.NEXT_PUBLIC_IPFS_GATEWAY
      )
      const res = await fetch(pinataURL)
      const metadata: GuildCredentialMetadata = await res.json()

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

  return usersCredentialMetadataJSONs
}

const fetchGuildCredentials = async (_: string, addresses: string[]) => {
  const guildCredentialChains = Object.keys(GUILD_CREDENTIAL_CONTRACT) as Chain[]
  const responseArray = await Promise.all(
    guildCredentialChains.flatMap((chain) =>
      addresses.flatMap((address) => fetchGuildCredentialsOnChain(address, chain))
    )
  )

  return responseArray.flat()
}

const useGuildCredentials = (disabled = false) => {
  const { isActive } = useWeb3React()
  const { addresses } = useUser()
  const { id } = useGuild()

  const shouldFetch = Boolean(!disabled && isActive && addresses?.length && id)

  return useSWRImmutable<
    ({ chainId: number; tokenId: number } & GuildCredentialMetadata)[]
  >(shouldFetch ? ["guildCredentials", addresses, id] : null, fetchGuildCredentials)
}

export default useGuildCredentials
