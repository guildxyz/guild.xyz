import { InputGroup, InputLeftAddon } from "@chakra-ui/input"
import { Select } from "@chakra-ui/select"
import { useEffect, useState } from "react"
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
  "least members": (a: Guild, b: Guild) =>
    a.levels[0].membersCount - b.levels[0].membersCount,
  "most members": (a: Guild, b: Guild) =>
    b.levels[0].membersCount - a.levels[0].membersCount,
}

const OrderSelect = ({ guilds, setOrderedGuilds, orderedGuilds }) => {
  const [order, setOrder] = useState("newest")
  //   const [orderedGuilds, setOrderedGuilds] = useState(guilds)

  useEffect(() => {
    setOrderedGuilds(guilds.sort(ordering[order]))
  }, [guilds, order])

  return (
    <InputGroup size="lg" maxW="300px">
      <InputLeftAddon bg="gray.700">Order by</InputLeftAddon>
      <Select
        borderLeftRadius="0"
        onChange={(e) => setOrder(e.target.value)}
        value={order}
      >
        {Object.keys(ordering).map((option) => (
          <option value={option}>{option}</option>
        ))}
      </Select>
    </InputGroup>
  )
}

export default OrderSelect
