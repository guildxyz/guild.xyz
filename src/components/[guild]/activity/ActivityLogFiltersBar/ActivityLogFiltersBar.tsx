import { GridItem, SimpleGrid } from "@chakra-ui/react"
import StickyBar from "components/common/Layout/StickyBar"
import useGuild from "components/[guild]/hooks/useGuild"
import { useActivityLog } from "../ActivityLogContext"
import DateRangeInput from "./components/DateRangeInput"
import FiltersInput from "./components/FiltersInput"

const ActivityLogFiltersBar = (): JSX.Element => {
  const { isUserActivityLog } = useActivityLog()
  const { featureFlags } = useGuild()

  const shouldShowDateRangeInput = isUserActivityLog || featureFlags?.includes("CRM")

  return (
    <StickyBar>
      <SimpleGrid columns={3} gap={4}>
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
