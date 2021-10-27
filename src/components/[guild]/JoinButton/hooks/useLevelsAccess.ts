import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const fetchLevelsAccess = async (
  _: string,
  type: "group" | "guild",
  id: number,
  account: string
) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/${type}/levelsAccess/${id}/${account}`)
    .then((response: Response) => (response.ok ? response.json() : null))
    .then((data) =>
      data.map((address) => address.hasAccess).some((access) => access === true)
    )

const useLevelsAccess = (type: "group" | "guild", id: number) => {
  const { account, active } = useWeb3React()

  const shouldFetch = account

  const { data, isValidating } = useSWR(
    shouldFetch ? ["levelsAccess", type, id, account] : null,
    fetchLevelsAccess
  )

  if (!active) return { data, error: "Wallet not connected" }

  return { data, isLoading: data === undefined && isValidating }
}

export default useLevelsAccess
