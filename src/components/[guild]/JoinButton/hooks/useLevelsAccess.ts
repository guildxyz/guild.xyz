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

  const hasAccess = data
    ?.filter?.(({ guildId }) => guildIds.includes(guildId))
    ?.some?.(({ access }) => access)

  if (!active) return { data, error: "Wallet not connected" }

  return {
    hasAccess,
    isLoading: data === undefined && isValidating,
  }
}

export default useLevelsAccess
