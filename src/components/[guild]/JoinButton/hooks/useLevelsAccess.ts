import { useWeb3React } from "@web3-react/core"
import { useGuild } from "components/[guild]/Context"
import useSWR from "swr"

const fetchLevelsAccess = async (_: string, communityId: string, account: string) =>
  fetch(
    `${process.env.NEXT_PUBLIC_API}/community/levelsAccess/${communityId}/${account}`
  ).then((response: Response) => (response.ok ? response.json() : null))

const useLevelsAccess = () => {
  const { account, active } = useWeb3React()
  const { id } = useGuild()

  const shouldFetch = account

  const { data } = useSWR(
    shouldFetch ? ["levelsAccess", id, account] : null,
    fetchLevelsAccess
  )

  if (!active) return { data, error: "Wallet not connected" }

  return { data: data?.[0]?.hasAccess }
}

export default useLevelsAccess
