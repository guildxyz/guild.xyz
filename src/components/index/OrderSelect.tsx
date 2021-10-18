import {
  Icon,
  InputGroup,
  InputLeftAddon,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Select } from "@chakra-ui/select"
import useLocalStorage from "hooks/useLocalStorage"
import { SortAscending } from "phosphor-react"
import { Dispatch, useEffect } from "react"
import { Group, Guild } from "temporaryData/types"

const ordering = {
  name: (a: Guild | Group, b: Guild | Group) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  },
  oldest: (a: Guild | Group, b: Guild | Group) => a.id - b.id,
  newest: (a: Guild | Group, b: Guild | Group) => b.id - a.id,
  "most members": (a: Guild | Group, b: Guild | Group) =>
    b.members?.length - a.members?.length,
}

// const orderGuilds = (_, guilds, order) => [...guilds].sort(ordering[order])

type Props = {
  groups?: Group[]
  setOrderedGroups?: Dispatch<Group[]>
  guilds?: Guild[]
  setOrderedGuilds?: Dispatch<Guild[]>
}

const OrderSelect = ({
  groups,
  setOrderedGroups,
  guilds,
  setOrderedGuilds,
}: Props) => {
  const [order, setOrder] = useLocalStorage("order", "most members")

  useEffect(() => {
    // using spread to create a new object so React triggers an update
    if (guilds && setOrderedGuilds)
      setOrderedGuilds([...guilds].sort(ordering[order]))
    if (groups && setOrderedGroups)
      setOrderedGroups([...groups].sort(ordering[order]))
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

  const icon = useBreakpointValue({
    base: <Icon as={SortAscending} />,
    md: false,
  })

  return (
    <InputGroup
      size="lg"
      maxW={{ base: "50px", md: "full" }}
      sx={{
        ".chakra-select__wrapper": { h: "47px" },
      }}
    >
      <InputLeftAddon d={{ base: "none", md: "flex" }}>Order by</InputLeftAddon>
      <Select
        borderLeftRadius={{ md: "0" }}
        onChange={(e) => setOrder(e.target.value)}
        value={order}
        icon={icon ? (icon as JSX.Element) : undefined}
        w={{ base: "45px", md: "full" }}
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
