import { GridItem, Select, SimpleGrid } from "@chakra-ui/react"
import StickyBar from "components/common/Layout/StickyBar"
import { ActivityLogFiltersProvider } from "./components/ActivityLogFiltersContext"
import FiltersInput from "./components/FiltersInput"

const ActivityLogFiltersBar = (): JSX.Element => (
  <ActivityLogFiltersProvider>
    <StickyBar>
      <SimpleGrid columns={3} gap={4}>
        <GridItem colSpan={{ base: 3, sm: 2 }}>
          <FiltersInput />
        </GridItem>

        <GridItem colSpan={{ base: 3, sm: 1 }}>
          <Select>
            <option>Last 1 week</option>
          </Select>
        </GridItem>
      </SimpleGrid>
    </StickyBar>
  </ActivityLogFiltersProvider>
)

export default ActivityLogFiltersBar
