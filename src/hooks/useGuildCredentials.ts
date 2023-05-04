import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { Chain, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import { GUILD_CREDENTIAL_CONTRACT } from "utils/guildCheckout/constants"

const fetchGuildCredentialsOnChain = async (address: string, chain: Chain) => {
  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0])
  const contract = new Contract(
    GUILD_CREDENTIAL_CONTRACT[chain].address,
    GUILD_CREDENTIAL_CONTRACT[chain].abi,
    provider
  )

  let usersCredentialsOnChain = []

  try {
    usersCredentialsOnChain = await contract.tokensOfOwner(address)
  } catch {
    const balance = await contract.balanceOf(address)

    for (let i = 0; i < balance; i++) {
      const newTokenId = await contract.tokenOfOwnerByIndex(address, i)
      if (newTokenId) usersCredentialsOnChain.push(newTokenId)
    }
  }

  return usersCredentialsOnChain
}

const fetchGuildCredentials = async (_: string, addresses: string[]) => {
  const guildCredentialChains = Object.keys(GUILD_CREDENTIAL_CONTRACT) as Chain[]
  const responseArray = await Promise.all(
    guildCredentialChains.flatMap((chain) =>
      addresses.flatMap((address) => fetchGuildCredentialsOnChain(address, chain))
    )
  )

  const tokenIds = responseArray
    .flat()
    .map((idAsBigNumber) => idAsBigNumber.toNumber())

  return tokenIds
}

const useGuildCredentials = () => {
  const { isActive } = useWeb3React()
  const { addresses } = useUser()
  const { id } = useGuild()

  const shouldFetch = Boolean(isActive && addresses?.length && id)

  return useSWRImmutable(
    shouldFetch ? ["hasGuildCredentials", addresses, id] : null,
    fetchGuildCredentials
  )
}

export default useGuildCredentials
