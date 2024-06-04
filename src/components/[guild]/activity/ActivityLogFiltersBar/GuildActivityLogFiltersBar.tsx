import { HStack, Stack } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import StickyBar from "components/common/LegacyLayout/StickyBar"
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

  return (
    <StickyBar>
      <Stack spacing="3">
        <HStack justifyContent={"space-between"}>
          <RadioButtonGroup
            options={options}
            onChange={(newValue) =>
              changeActionGroup(newValue as ActivityLogActionGroup)
            }
            value={actionGroup}
            defaultValue={ActivityLogActionGroup.UserAction}
            chakraStyles={{
              spacing: 1.5,
              size: "sm",
            }}
          ></RadioButtonGroup>

          {shouldShowDateRangeInput && <DateRangeInput />}
        </HStack>

        <FiltersInput />
      </Stack>
    </StickyBar>
  )
}

export default GuildActivityLogFiltersBar
