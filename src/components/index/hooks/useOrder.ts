import { useEffect, useState } from "react"
import useSWR from "swr"
import { Guild, Role } from "temporaryData/types"

const ordering = {
  name: (a: Role | Guild, b: Role | Guild) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  },
  oldest: (a: Role | Guild, b: Role | Guild) => a.id - b.id,
  newest: (a: Role | Guild, b: Role | Guild) => b.id - a.id,
  "most members": (a: Role | Guild, b: Role | Guild) =>
    b.members?.length - a.members?.length,
}

// TODO: Roles? Guilds?...
const orderRoles = (_, data, order) => [...data].sort(ordering[order])

const useOrder = (data: Array<Role | Guild>, order) => {
  const { data: orderedData } = useSWR(["order", data, order], orderRoles, {
    dedupingInterval: 9000000,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData: [],
  })

  const [cachedData, setCachedData] = useState(orderedData)

  useEffect(() => {
    if (orderedData.length) setCachedData(orderedData)
  }, [orderedData])

  return cachedData
}

export default useOrder
export { ordering }
