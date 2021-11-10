import { useEffect, useState } from "react"
import useSWR from "swr"
import { Guild, Hall } from "temporaryData/types"

const ordering = {
  name: (a: Guild | Hall, b: Guild | Hall) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  },
  oldest: (a: Guild | Hall, b: Guild | Hall) => a.id - b.id,
  newest: (a: Guild | Hall, b: Guild | Hall) => b.id - a.id,
  "most members": (a: Guild | Hall, b: Guild | Hall) =>
    b.members?.length - a.members?.length,
}

const orderGuilds = (_, data, order) => [...data].sort(ordering[order])

const useOrder = (data: Array<Guild | Hall>, order) => {
  const { data: orderedData } = useSWR(["order", data, order], orderGuilds, {
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
