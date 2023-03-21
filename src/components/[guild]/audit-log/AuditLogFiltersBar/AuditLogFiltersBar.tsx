import { GridItem, Select, SimpleGrid } from "@chakra-ui/react"
import StickyBar from "components/common/Layout/StickyBar"
import FiltersInput from "./components/FiltersInput"

const AuditLogFiltersBar = (): JSX.Element => (
  <StickyBar>
    <SimpleGrid columns={3} gap={4}>
      <GridItem colSpan={2}>
        <FiltersInput />
      </GridItem>

      <GridItem>
        <Select>
          <option>Last 1 week</option>
        </Select>
      </GridItem>
    </SimpleGrid>
  </StickyBar>
)

export default AuditLogFiltersBar
