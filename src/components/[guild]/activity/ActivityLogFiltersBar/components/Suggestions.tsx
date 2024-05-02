import { Stack, Text } from "@chakra-ui/react"
import * as combobox from "@zag-js/combobox"
import { HTMLAttributes, useMemo } from "react"
import { useActivityLog } from "../../ActivityLogContext"
import {
  SupportedQueryParam,
  useActivityLogFilters,
} from "./ActivityLogFiltersContext"
import Suggestion from "./Suggestion"

type Props = {
  contentProps: HTMLAttributes<HTMLElement>
  getOptionProps: (props: combobox.OptionProps) => HTMLAttributes<HTMLElement>
}

const Suggestions = ({ contentProps, getOptionProps }: Props) => {
  const { activityLogType } = useActivityLog()
  const { activeFilters } = useActivityLogFilters()

  const shouldRenderSuggestions = useMemo((): {
    guild: boolean
    user: boolean
    role: boolean
    reward: boolean
    action: boolean
  } => {
    const isActiveFilter = (filter: SupportedQueryParam) =>
      activeFilters?.some((af) => af.filter === filter)

    switch (activityLogType) {
      case "all":
        return {
          guild: !isActiveFilter("guildId"),
          user: true,
          role: !isActiveFilter("roleId") && isActiveFilter("guildId"),
          reward: !isActiveFilter("rolePlatformId") && isActiveFilter("guildId"),
          action: true,
        }
      case "user":
        return {
          guild: !isActiveFilter("guildId"),
          user: false,
          role: false,
          reward: false,
          action: true,
        }
      case "guild":
        return {
          guild: false,
          user: true,
          role: !isActiveFilter("roleId"),
          reward: !isActiveFilter("rolePlatformId"),
          action: true,
        }
      default:
        return {
          guild: false,
          user: false,
          role: false,
          reward: false,
          action: false,
        }
    }
  }, [activeFilters, activityLogType])

  return (
    <Stack spacing={0} {...contentProps}>
      {shouldRenderSuggestions.user && (
        <Suggestion
          label="User"
          {...getOptionProps({ label: "User", value: "userId" })}
        >
          <Text as="span" colorScheme="gray" fontWeight="normal" noOfLines={1}>
            Filter by wallet addresses
          </Text>
        </Suggestion>
      )}

      {shouldRenderSuggestions.guild && (
        <Suggestion
          label="Guild"
          {...getOptionProps({ label: "Guild", value: "guildId" })}
        >
          <Text as="span" colorScheme="gray" fontWeight="normal" noOfLines={1}>
            Filter by guild
          </Text>
        </Suggestion>
      )}

      {shouldRenderSuggestions.role && (
        <Suggestion
          label="Role"
          {...getOptionProps({ label: "Role", value: "roleId" })}
        >
          <Text as="span" colorScheme="gray" fontWeight="normal" noOfLines={1}>
            Filter by role
          </Text>
        </Suggestion>
      )}

      {shouldRenderSuggestions.reward && (
        <Suggestion
          label="Reward"
          {...getOptionProps({ label: "Reward", value: "rolePlatformId" })}
        >
          <Text as="span" colorScheme="gray" fontWeight="normal" noOfLines={1}>
            Filter by reward
          </Text>
        </Suggestion>
      )}

      {shouldRenderSuggestions.action && (
        <Suggestion
          label="Action"
          {...getOptionProps({ label: "Action", value: "action" })}
        >
          <Text as="span" colorScheme="gray" fontWeight="normal" noOfLines={1}>
            Filter by action
          </Text>
        </Suggestion>
      )}
    </Stack>
  )
}

export default Suggestions
