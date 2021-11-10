import { useMemo } from "react"

const filterByName = (name: string, searchInput: string) =>
  name.toLowerCase().includes(searchInput.toLowerCase())

const useFilteredData = (ordered, users, searchInput) => {
  const filtered = useMemo(
    () => ordered.filter(({ name }) => filterByName(name, searchInput)),
    [ordered, searchInput]
  )

  const usersFiltered = useMemo(
    () => users.filter(({ name }) => filterByName(name, searchInput)),
    [users, searchInput]
  )

  return [filtered, usersFiltered]
}

export default useFilteredData
