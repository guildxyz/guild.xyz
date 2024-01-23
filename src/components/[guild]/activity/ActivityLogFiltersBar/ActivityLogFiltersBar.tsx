import { GridItem, SimpleGrid } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import StickyBar from "components/common/Layout/StickyBar"
import { useActivityLog } from "../ActivityLogContext"
import { useActivityLogFilters } from "./components/ActivityLogFiltersContext"
import DateRangeInput from "./components/DateRangeInput"
import FiltersInput from "./components/FiltersInput"

const ActivityLogFiltersBar = (): JSX.Element => {
  const { isUserActivityLog, withActionGroups, actionGroup, setActionGroup } =
    useActivityLog()
  const { featureFlags } = useGuild()

  const shouldShowDateRangeInput = isUserActivityLog || featureFlags?.includes("CRM")

  const { clearFilters } = useActivityLogFilters()

  return (
    <StickyBar>
      <SimpleGrid columns={3} gap={3}>
        <GridItem colSpan={shouldShowDateRangeInput ? { base: 3, md: 2 } : 3}>
          <FiltersInput />
        </GridItem>

        {shouldShowDateRangeInput && (
          <GridItem colSpan={{ base: 3, md: 1 }}>
            <DateRangeInput />
          </GridItem>
        )}
      </SimpleGrid>
    </StickyBar>
  )
}

export default ActivityLogFiltersBar
