import {
  Icon,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { CaretDown } from "phosphor-react"
import { ChangeEvent } from "react"
import {
  SupportedQueryParam,
  useActivityLogFilters,
} from "./ActivityLogFiltersContext"

const CURRENT_TIMESTAMP = Date.now()
const MONTH_IN_MILISEC = 30 * 24 * 60 * 60 * 1000
const LAST_MONTH_TIMESTAMP = CURRENT_TIMESTAMP - MONTH_IN_MILISEC

const timestampToDateString = (ts?: number): string =>
  ts ? new Date(ts).toISOString().split("T")[0] : ""

const CURRENT_DATE = timestampToDateString(CURRENT_TIMESTAMP)

const DateRangeInput = () => {
  const buttonBgColor = useColorModeValue("white", "blackAlpha.300")

  const { activeFilters, addFilter, updateFilter, removeFilter } =
    useActivityLogFilters()
  const beforeFilter = activeFilters?.find(({ filter }) => filter === "before")
  const afterFilter = activeFilters?.find(({ filter }) => filter === "after")

  const beforeInputValue = timestampToDateString(
    beforeFilter ? Number(beforeFilter.value) : undefined
  )
  const afterInputValue = timestampToDateString(
    afterFilter ? Number(afterFilter.value) : undefined
  )

  const onChange = (
    e: ChangeEvent<HTMLInputElement>,
    filter: Extract<SupportedQueryParam, "before" | "after">
  ) => {
    const filterToUpdate = filter === "before" ? beforeFilter : afterFilter

    const newTimestamp = !isNaN(e.target.valueAsNumber)
      ? e.target.valueAsNumber
      : undefined

    if (!newTimestamp) {
      removeFilter(filterToUpdate)
      return
    }

    if (newTimestamp) {
      const value = newTimestamp.toString()
      if (filterToUpdate) {
        updateFilter({ ...filterToUpdate, value })
      } else {
        addFilter({ filter, value })
      }
    }
  }

  const buttonLabel =
    beforeInputValue && afterInputValue
      ? `${afterInputValue} - ${beforeInputValue}`
      : beforeInputValue
      ? `Before ${beforeInputValue}`
      : afterInputValue
      ? `After ${afterInputValue}`
      : "Last 30 days"

  return (
    <Popover matchWidth>
      <PopoverTrigger>
        <Button
          variant="unstyled"
          bgColor={buttonBgColor}
          h={10}
          boxSizing="border-box"
          px={3}
          fontWeight="normal"
          w="full"
          display="flex"
          justifyContent="space-between"
          borderWidth={1}
          borderRadius="lg"
          rightIcon={<Icon as={CaretDown} boxSize={3.5} />}
          _focusVisible={{
            boxShadow: "0 0 0 1px var(--chakra-colors-gray-500)",
          }}
        >
          {buttonLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent minW="none" w="none">
        <PopoverBody p={2}>
          <Stack>
            <Input
              type="date"
              name="after"
              min={timestampToDateString(LAST_MONTH_TIMESTAMP)}
              max={beforeInputValue || CURRENT_DATE}
              value={afterInputValue}
              onChange={(e) => onChange(e, "after")}
            />
            <Input
              type="date"
              name="before"
              min={afterInputValue}
              max={CURRENT_DATE}
              value={beforeInputValue}
              onChange={(e) => onChange(e, "before")}
            />
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
export default DateRangeInput
