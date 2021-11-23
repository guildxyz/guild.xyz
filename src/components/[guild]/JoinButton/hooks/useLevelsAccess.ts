import { useWeb3React } from "@web3-react/core"
import useHall from "components/[hall]/hooks/useHall"
import useSWR from "swr"

const useLevelsAccess = (guildIds?: number[]) => {
  const { account, active } = useWeb3React()
  const { id } = useHall()

  const shouldFetch = account

  const { data, isValidating } = useSWR(
    shouldFetch ? `/group/levelsAccess/${id}/${account}` : null
  )

  // temporary until guilds are grouped by platform already in the endpoint
  const relevantGuilds = data?.filter?.(({ guildId }) => guildIds.includes(guildId))

  // temporary until join happens by platform id instead of guild
  const firstGuildIdWithAccess = relevantGuilds?.find?.(
    ({ access }) => access
  )?.guildId

  if (!active) return { data, error: "Wallet not connected" }

  return {
    hasAccess: !!firstGuildIdWithAccess,
    isLoading: data === undefined && isValidating,
    firstGuildIdWithAccess,
  }
}

export default useLevelsAccess
