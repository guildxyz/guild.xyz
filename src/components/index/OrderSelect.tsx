import {
  Icon,
  InputGroup,
  InputLeftAddon,
  Select,
  useBreakpointValue,
} from "@chakra-ui/react"
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

// const orderGuilds = (_, data, order) => [...guilds].sort(ordering[order])

type Props = {
  data?: Array<Group | Guild>
  setOrderedData?: Dispatch<Array<Group | Guild>>
}

const OrderSelect = ({ data, setOrderedData }: Props) => {
  const [order, setOrder] = useLocalStorage("order", "most members")

  useEffect(() => {
    // using spread to create a new object so React triggers an update
    if (data && setOrderedData) setOrderedData([...data].sort(ordering[order]))
  }, [data, order])

  /**
   * We could use SWR to spare recalculating the sorted arrays, but with the number
   * of data we have now I haven't noticed any relevant performance gain even at 6x
   * slowdown, so it's better to save memory instead
   */
  // const { data: orderedData } = useSWR(["order", data, order], orderGuilds, {
  //   dedupingInterval: 9000000,
  //   revalidateOnFocus: false,
  //   revalidateOnReconnect: false,
  // })

  // useEffect(() => {
  //   if (orderedData) setOrderedData(orderedData)
  // }, [orderedData])

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
