import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { Chain, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import { GUILD_CREDENTIAL_CONTRACT } from "utils/guildCheckout/constants"

const fetchHasGuildCredentialsOnChain = async (
  address: string,
  chain: Chain,
  guildId: number
) => {
  const PAGE_SIZE = 1000
  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0])
  const contract = new Contract(
    GUILD_CREDENTIAL_CONTRACT[chain].address,
    GUILD_CREDENTIAL_CONTRACT[chain].abi,
    provider
  )
  const currentBlock = await provider.getBlockNumber()
  let from = currentBlock - PAGE_SIZE
  let to = currentBlock

  const claimedEvents = []

  let shouldPaginate = true
  do {
    const newEvents = await contract.queryFilter(
      contract.filters.Claimed(address, null, guildId),
      from,
      to
    )

    if (!newEvents.length) {
      shouldPaginate = false
    } else {
      claimedEvents.push(newEvents)
      to = from
      from -= PAGE_SIZE
    }
  } while (shouldPaginate)

  return claimedEvents
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
