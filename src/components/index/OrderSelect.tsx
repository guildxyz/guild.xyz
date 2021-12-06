import {
  Icon,
  InputGroup,
  InputLeftAddon,
  Select,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react"
import { CaretDown, SortAscending } from "phosphor-react"

export type Options = "name" | "oldest" | "newest" | "members"
const OPTIONS = ["name", "oldest", "newest", "members"]

type Props = {
  isLoading?: boolean
  order: Options
  setOrder: (option: Options) => void
}

const OrderSelect = ({ isLoading, order, setOrder }: Props): JSX.Element => {
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
        isDisabled={isLoading}
        borderLeftRadius={{ md: "0" }}
        onChange={(e) => setOrder(e.target.value as Options)}
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
