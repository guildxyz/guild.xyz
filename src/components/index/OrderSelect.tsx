import {
  Icon,
  InputGroup,
  InputLeftAddon,
  Select,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { SortAscending } from "phosphor-react"
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
  members: (a: Guild, b: Guild) => b.members?.length - a.members?.length,
}

const OrderSelect = (): JSX.Element => {
  const icon = useBreakpointValue({
    base: <Icon as={SortAscending} />,
    md: false,
  })

  const router = useRouter()
  const [order, setOrder] = useState("members")

  // Replacing the URL if ordering changes
  useEffect(() => {
    if (order === router.query.order) return

    const newQuery = {
      ...router.query,
      order,
    }

    router.replace({ pathname: router.pathname, query: newQuery })
  }, [order])

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
