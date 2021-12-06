import {
  Icon,
  InputGroup,
  InputLeftAddon,
  Select,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { CaretDown, SortAscending } from "phosphor-react"
import { useEffect, useState } from "react"

const ordering = ["name", "oldest", "newest", "members"]

type Props = {
  isLoading?: boolean
}

const OrderSelect = ({ isLoading }: Props): JSX.Element => {
  const icon = useBreakpointValue({
    base: <Icon as={SortAscending} />,
    md: <Icon as={CaretDown} pr="1" mr="1" />,
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
        icon={
          isLoading ? (
            <Icon
              as={Spinner}
              size="sm"
              mr={{ md: "2" }}
              // forcing spinner-size so it doesn't get overwritten by the styles added by select
              w="var(--spinner-size) !important"
              h="var(--spinner-size) !important"
            />
          ) : (
            icon
          )
        }
        w={{ base: "45px", md: "full" }}
      >
        {ordering.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </InputGroup>
  )
}

export default OrderSelect
