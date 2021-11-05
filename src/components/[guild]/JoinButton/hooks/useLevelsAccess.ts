import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import fetchApi from "utils/fetchApi"

const fetchLevelsAccess = async (endpoint: string) =>
  fetchApi(endpoint).then((data) =>
    data
      ? data.map((address) => address.hasAccess).some((access) => access === true)
      : false
  )

const useLevelsAccess = (type: "group" | "guild", id: number) => {
  const { account, active } = useWeb3React()

  const shouldFetch = account

  const { data, isValidating } = useSWR(
    shouldFetch ? `/${type}/levelsAccess/${id}/${account}` : null,
    fetchLevelsAccess
  )

  if (!active) return { data, error: "Wallet not connected" }

  return { data, isLoading: data === undefined && isValidating }
}

export default useLevelsAccess
