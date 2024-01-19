import { GridItem, HStack, SimpleGrid, useColorModeValue } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import StickyBar from "components/common/Layout/StickyBar"
import { useActivityLog } from "../ActivityLogContext"
import { ActivityLogActionGroup } from "../constants"
import { useActivityLogFilters } from "./components/ActivityLogFiltersContext"
import DateRangeInput from "./components/DateRangeInput"
import FiltersInput from "./components/FiltersInput"

const ActivityLogFiltersBar = (): JSX.Element => {
  const { isUserActivityLog, withActionGroups, actionGroup, setActionGroup } =
    useActivityLog()
  const { featureFlags } = useGuild()

  const shouldShowDateRangeInput = isUserActivityLog || featureFlags?.includes("CRM")

  const { clearFilters } = useActivityLogFilters()

  const btnActiveColor = useColorModeValue(
    "var(--chakra-colors-indigo-100)",
    "var(--chakra-colors-indigo-500)"
  )

  const changeActionGroup = (value: ActivityLogActionGroup) => {
    setActionGroup(value)
    clearFilters(["action"])
  }

  const ActionGroupButtons = (): JSX.Element => (
    <GridItem colSpan={{ base: 3, md: 2 }}>
      <HStack gap={2}>
        <Button
          _active={{
            bg: btnActiveColor,
          }}
          isActive={actionGroup === ActivityLogActionGroup.UserAction}
          onClick={() => changeActionGroup(ActivityLogActionGroup.UserAction)}
        >
          User actions
        </Button>
        <Button
          _active={{
            bg: btnActiveColor,
          }}
          isActive={actionGroup === ActivityLogActionGroup.AdminAction}
          onClick={() => changeActionGroup(ActivityLogActionGroup.AdminAction)}
        >
          Admin actions
        </Button>
      </HStack>
    </GridItem>
  )

  return (
    <StickyBar>
      <SimpleGrid columns={3} gap={4}>
        {withActionGroups ? (
          <>
            <ActionGroupButtons />
            {shouldShowDateRangeInput && (
              <GridItem colSpan={{ base: 3, md: 1 }}>
                <DateRangeInput />
              </GridItem>
            )}

            <GridItem colSpan={3}>
              <FiltersInput />
            </GridItem>
          </>
        ) : (
          <>
            <GridItem colSpan={shouldShowDateRangeInput ? { base: 3, md: 2 } : 3}>
              <FiltersInput />
            </GridItem>

            {shouldShowDateRangeInput && (
              <GridItem colSpan={{ base: 3, md: 1 }}>
                <DateRangeInput />
              </GridItem>
            )}
          </>
        )}
      </SimpleGrid>
    </StickyBar>
  )
}

export default ActivityLogFiltersBar
