import {
  Icon,
  InputGroup,
  InputLeftAddon,
  ScaleFade,
  Select,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { SortAscending } from "phosphor-react"
import { useEffect, useState } from "react"

const ordering = ["name", "oldest", "newest", "members"]

type Props = {
  isLoading?: boolean
}

const OrderSelect = ({ isLoading }: Props): JSX.Element => {
  const icon = useBreakpointValue({
    base: isLoading ? <Spinner size="sm" /> : <Icon as={SortAscending} />,
    md: false,
  })

  const router = useRouter()
  const [order, setOrder] = useState("members")

  // Replacing the URL if ordering changes
  useEffect(() => {
    if (order === router.query.sort) return

    const newQuery = {
      ...router.query,
      sort: order,
    }

    router.replace({ pathname: router.pathname, query: newQuery })
  }, [order])

  return (
    <InputGroup
      position="relative"
      size="lg"
      maxW={{ base: "50px", md: "full" }}
      sx={{
        ".chakra-select__wrapper": { h: "47px" },
      }}
    >
      <InputLeftAddon d={{ base: "none", md: "flex" }}>Order by</InputLeftAddon>
      <Select
        isDisabled={isLoading}
        borderLeftRadius={{ md: "0" }}
        onChange={(e) => setOrder(e.target.value)}
        value={order}
        icon={icon ? (icon as JSX.Element) : undefined}
        w={{ base: "45px", md: "full" }}
      >
        {ordering.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
      <ScaleFade in={isLoading}>
        <Spinner
          display={{ base: "none", md: "block" }}
          position="absolute"
          top={4}
          right={9}
          size="sm"
        />
      </ScaleFade>
    </InputGroup>
  )
}

export default OrderSelect
