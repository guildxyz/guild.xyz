import { useMemo } from "react"

const filterByName = (name: string, searchInput: string) =>
  name.toLowerCase().includes(searchInput.toLowerCase())

const useFilteredData = (ordered, users, searchInput) => {
  const filtered = useMemo(
    () =>
      searchInput
        ? ordered.filter(({ name }) => filterByName(name, searchInput))
        : ordered,
    [ordered, searchInput]
  )

  const usersFiltered = useMemo(
    () =>
      searchInput
        ? users.filter(({ name }) => filterByName(name, searchInput))
        : users,
    [users, searchInput]
  )

  return [filtered, usersFiltered]
}

export default useFilteredData
