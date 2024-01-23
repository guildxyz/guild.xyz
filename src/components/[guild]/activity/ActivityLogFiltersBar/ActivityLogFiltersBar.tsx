import { GridItem, SimpleGrid } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import StickyBar from "components/common/Layout/StickyBar"
import RadioButtonGroup from "components/common/RadioButtonGroup"
import { useActivityLog } from "../ActivityLogContext"
import { ActivityLogActionGroup } from "../constants"
import { useActivityLogFilters } from "./components/ActivityLogFiltersContext"
import DateRangeInput from "./components/DateRangeInput"
import FiltersInput from "./components/FiltersInput"

const options = [
  {
    label: ActivityLogActionGroup.UserAction,
    value: ActivityLogActionGroup.UserAction,
  },
  {
    label: ActivityLogActionGroup.AdminAction,
    value: ActivityLogActionGroup.AdminAction,
  },
]

const ActivityLogFiltersBar = (): JSX.Element => {
  const { isUserActivityLog, withActionGroups, actionGroup, setActionGroup } =
    useActivityLog()
  const { featureFlags } = useGuild()

  const shouldShowDateRangeInput = isUserActivityLog || featureFlags?.includes("CRM")

  const { clearFilters } = useActivityLogFilters()

  const changeActionGroup = (value: ActivityLogActionGroup) => {
    setActionGroup(value)
    clearFilters(["action"])
  }

  const ActionGroupButtons = (): JSX.Element => (
    <GridItem colSpan={{ base: 3, md: 2 }}>
      <RadioButtonGroup
        options={options}
        onChange={(newValue) =>
          changeActionGroup(newValue as ActivityLogActionGroup)
        }
        value={actionGroup}
        defaultValue={ActivityLogActionGroup.UserAction}
        chakraStyles={{ w: { base: "full", md: "auto" }, spacing: 1.5, size: "sm" }}
      ></RadioButtonGroup>
    </GridItem>
  )

  return (
    <StickyBar>
      <SimpleGrid columns={3} gap={3}>
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
