import { GridItem, SimpleGrid } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import StickyBar from "components/common/Layout/StickyBar"
import RadioButtonGroup from "components/common/RadioButtonGroup"
import { useEffect } from "react"
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

const GuildActivityLogFiltersBar = (): JSX.Element => {
  const { actionGroup, setActionGroup } = useActivityLog()

  useEffect(() => {
    setActionGroup(ActivityLogActionGroup.UserAction)
  }, [setActionGroup])

  const { featureFlags } = useGuild()

  const shouldShowDateRangeInput = featureFlags?.includes("CRM")

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
        <ActionGroupButtons />
        {shouldShowDateRangeInput && (
          <GridItem colSpan={{ base: 3, md: 1 }}>
            <DateRangeInput h={8} fontSize={"sm"} />
          </GridItem>
        )}

        <GridItem colSpan={3}>
          <FiltersInput />
        </GridItem>
      </SimpleGrid>
    </StickyBar>
  )
}

export default GuildActivityLogFiltersBar
