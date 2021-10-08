import { InputGroup, InputLeftAddon } from "@chakra-ui/react"
import { Select } from "@chakra-ui/select"
import useLocalStorage from "hooks/useLocalStorage"
import { Dispatch, useEffect } from "react"
import { Guild } from "temporaryData/types"

const ordering = {
  name: (a: Guild, b: Guild) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  },
  oldest: (a: Guild, b: Guild) => a.id - b.id,
  newest: (a: Guild, b: Guild) => b.id - a.id,
  // Checking if guilds have levels, to avoid backend errors...
  // "least members": (a: Guild, b: Guild) =>
  //   a.levels[0]?.members && b.levels[0]?.members
  //     ? a.levels[0].members.length - b.levels[0].members.length
  //     : 0,
  "most members": (a: Guild, b: Guild) =>
    a.levels[0]?.members && b.levels[0]?.members
      ? b.levels[0].members.length - a.levels[0].members.length
      : 0,
}

// const orderGuilds = (_, guilds, order) => [...guilds].sort(ordering[order])

type Props = {
  guilds: Guild[]
  setOrderedGuilds: Dispatch<Guild[]>
}

const OrderSelect = ({ guilds, setOrderedGuilds }: Props) => {
  const [order, setOrder] = useLocalStorage("order", "most members")

  useEffect(() => {
    // using spread to create a new object so React triggers an update
    setOrderedGuilds([...guilds].sort(ordering[order]))
  }, [guilds, order])

  /**
   * We could use SWR to spare recalculating the sorted arrays, but with the number
   * of guilds we have now I haven't noticed any relevant performance gain even at 6x
   * slowdown, so it's better to save memory instead
   */
  // const { data } = useSWR(["order", guilds, order], orderGuilds, {
  //   dedupingInterval: 9000000,
  //   revalidateOnFocus: false,
  //   revalidateOnReconnect: false,
  // })

  // useEffect(() => {
  //   if (data) setOrderedGuilds(data)
  // }, [data])

  return (
    <InputGroup size="lg" maxW="300px">
      <InputLeftAddon>Order by</InputLeftAddon>
      <Select
        borderLeftRadius="0"
        onChange={(e) => setOrder(e.target.value)}
        value={order}
      >
        {Object.keys(ordering).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </InputGroup>
  )
}

export default OrderSelect
