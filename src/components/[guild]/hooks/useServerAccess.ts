// Check if the user has access to at least one guild on a DC server / TG group
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import fetchApi from "utils/fetchApi"

const fetchServerAccess = async (
  _: string,
  account: string,
  guildIds: Array<number>
): Promise<boolean> =>
  Promise.all(
    guildIds.map((id) => fetchApi(`/guild/levelsAccess/${id}/${account}`))
  ).then(
    (data) =>
      data
        ?.reduce((arr1, arr2) => arr1.concat(arr2))
        .some((access) => access === true) || false
  )

const useServerAccess = (guildIds: Array<number>) => {
  const { account } = useWeb3React()

  const { data, isValidating } = useSWR(
    account ? ["serverAccess", account, guildIds] : null,
    fetchServerAccess
  )

  return { data, isLoading: data === undefined && isValidating }
}

export default useServerAccess
