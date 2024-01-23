import { GridItem, SimpleGrid } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import StickyBar from "components/common/Layout/StickyBar"
import DateRangeInput from "./components/DateRangeInput"
import FiltersInput from "./components/FiltersInput"

const UserActivityLogFiltersBar = (): JSX.Element => {
  const { featureFlags } = useGuild()

  const shouldShowDateRangeInput = featureFlags?.includes("CRM")

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

export default UserActivityLogFiltersBar
