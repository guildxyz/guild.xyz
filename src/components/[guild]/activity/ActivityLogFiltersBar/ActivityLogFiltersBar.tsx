import { GridItem, SimpleGrid } from "@chakra-ui/react"
import StickyBar from "components/common/Layout/StickyBar"
import DateRangeInput from "./components/DateRangeInput"
import FiltersInput from "./components/FiltersInput"

const ActivityLogFiltersBar = (): JSX.Element => (
  <StickyBar>
    <SimpleGrid columns={3} gap={4}>
      <GridItem colSpan={{ base: 3, md: 2 }}>
        <FiltersInput />
      </GridItem>

      <GridItem colSpan={{ base: 3, md: 1 }}>
        <DateRangeInput />
      </GridItem>
    </SimpleGrid>
  </StickyBar>
)

export default ActivityLogFiltersBar
