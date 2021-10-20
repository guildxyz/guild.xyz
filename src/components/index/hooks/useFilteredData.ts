import { useWeb3React } from "@web3-react/core"
import { useMemo } from "react"

const filterByName = (name: string, searchInput: string) =>
  name.toLowerCase().includes(searchInput.toLowerCase())

const useFilteredData = (ordered, usersIds, searchInput) => {
  const { account } = useWeb3React()

  const users = useMemo(
    () =>
      ordered.filter(
        ({ id, owner: { addresses } }) =>
          usersIds?.includes(id) || addresses.includes(account?.toLowerCase())
      ),
    [ordered, usersIds, account]
  )

  const filtered = useMemo(
    () => ordered.filter(({ name }) => filterByName(name, searchInput)),
    [ordered, searchInput]
  )

  const usersFiltered = useMemo(
    () => users.filter(({ name }) => filterByName(name, searchInput)),
    [users, searchInput]
  )

  return [users, filtered, usersFiltered]
}

export default useFilteredData
