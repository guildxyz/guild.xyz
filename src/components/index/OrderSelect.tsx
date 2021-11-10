import {
  Icon,
  InputGroup,
  InputLeftAddon,
  Select,
  useBreakpointValue,
} from "@chakra-ui/react"
import { SortAscending } from "phosphor-react"
import { ordering } from "./hooks/useOrder"

const OrderSelect = ({ order, setOrder }) => {
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
