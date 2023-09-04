import { GridItem, SimpleGrid } from "@chakra-ui/react"
import StickyBar from "components/common/Layout/StickyBar"
import { ActivityLogFiltersProvider } from "./components/ActivityLogFiltersContext"
import DateRangeInput from "./components/DateRangeInput"
import FiltersInput from "./components/FiltersInput"

const ActivityLogFiltersBar = (): JSX.Element => (
  <ActivityLogFiltersProvider>
    <StickyBar>
      <SimpleGrid columns={3} gap={4}>
        <GridItem colSpan={{ base: 3, sm: 2 }}>
          <FiltersInput />
        </GridItem>

        <GridItem colSpan={{ base: 3, sm: 1 }}>
          <DateRangeInput />
        </GridItem>
      </SimpleGrid>
    </StickyBar>
  </ActivityLogFiltersProvider>
)

export default ActivityLogFiltersBar
