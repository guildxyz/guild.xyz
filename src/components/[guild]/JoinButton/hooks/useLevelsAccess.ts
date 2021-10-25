import { useWeb3React } from "@web3-react/core"
import { useGuild } from "components/[guild]/Context"
import { useHall } from "components/[hall]/Context"
import useSWR from "swr"

const fetchLevelsAccess = async (
  type: "group" | "guild",
  id: number,
  account: string
) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/${type}/levelsAccess/${id}/${account}`)
    .then((response: Response) => (response.ok ? response.json() : null))
    .then((data) =>
      data.map((address) => address.hasAccess).some((access) => access === true)
    )

const useLevelsAccess = () => {
  const { account, active } = useWeb3React()
  const hall = useHall()
  const guild = useGuild()

  const shouldFetch = account

  const { data } = useSWR(
    shouldFetch ? ["levelsAccess", hall?.id, guild?.id, account] : null,
    () => fetchLevelsAccess(hall ? "group" : "guild", hall?.id || guild?.id, account)
  )

  if (!active) return { data, error: "Wallet not connected" }

  return { data }
}

export default useLevelsAccess
