import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { Chain, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import { GUILD_CREDENTIAL_CONTRACT } from "utils/guildCheckout/constants"

const fetchHasGuildCredentialsOnChain = (
  address: string,
  chain: Chain,
  guildId: number
) => {
  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0])
  const contract = new Contract(
    GUILD_CREDENTIAL_CONTRACT[chain].address,
    GUILD_CREDENTIAL_CONTRACT[chain].abi,
    provider
  )

  return contract.queryFilter(contract.filters.Claimed(address, null, guildId))
}

const fetchHasGuildCredentials = async (
  _: string,
  addresses: string[],
  guildId: number
) => {
  const guildCredentialChains = Object.keys(GUILD_CREDENTIAL_CONTRACT) as Chain[]
  const responseArray = await Promise.all(
    guildCredentialChains.flatMap((chain) =>
      addresses.flatMap((address) =>
        fetchHasGuildCredentialsOnChain(address, chain, guildId)
      )
    )
  )
  return responseArray.flat().length > 0
}

const useHasGuildCredential = () => {
  const { isActive } = useWeb3React()
  const { addresses } = useUser()
  const { id } = useGuild()

  const shouldFetch = Boolean(isActive && addresses?.length && id)

  return useSWRImmutable(
    shouldFetch ? ["hasGuildCredentials", addresses, id] : null,
    fetchHasGuildCredentials
  )
}

export default useHasGuildCredential
