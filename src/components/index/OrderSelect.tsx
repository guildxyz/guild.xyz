import {
  Icon,
  InputGroup,
  InputLeftAddon,
  Select,
  useBreakpointValue,
} from "@chakra-ui/react"
import { CaretDown, SortAscending } from "phosphor-react"

export type OrderOptions = "name" | "oldest" | "newest" | "members"
const OPTIONS = ["name", "oldest", "newest", "members"]

type Props = {
  order: OrderOptions
  setOrder: (option: OrderOptions) => void
}

const OrderSelect = ({ order, setOrder }: Props): JSX.Element => {
  const icon = useBreakpointValue({
    base: <Icon as={SortAscending} />,
    md: <Icon as={CaretDown} pr="1" mr="1" />,
  })

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
        borderLeftRadius={{ md: "0" }}
        onChange={(e) => setOrder(e.target.value as OrderOptions)}
        value={order}
        icon={icon}
        w={{ base: "45px", md: "full" }}
      >
        {OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </InputGroup>
  )
}

export default OrderSelect
