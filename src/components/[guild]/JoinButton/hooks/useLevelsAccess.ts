import { useWeb3React } from "@web3-react/core"
import { useGroup } from "components/[group]/Context"
import { useGuild } from "components/[guild]/Context"
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

const useLevelsAccess = (guildId?: number) => {
  const { account, active } = useWeb3React()
  const group = useGroup()
  const guild = useGuild()

  const shouldFetch = account

  const { data } = useSWR(
    shouldFetch ? ["levelsAccess", guildId, group?.id, guild?.id, account] : null,
    () =>
      fetchLevelsAccess(
        guildId || guild ? "guild" : "group",
        guildId || group?.id || guild?.id,
        account
      )
  )

  if (!active) return { data, error: "Wallet not connected" }

  return { data }
}

export default useLevelsAccess
