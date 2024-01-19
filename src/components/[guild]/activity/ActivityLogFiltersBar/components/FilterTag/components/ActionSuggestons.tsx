import { Text } from "@chakra-ui/react"
import * as combobox from "@zag-js/combobox"
import ActionIcon from "components/[guild]/activity/ActivityLogAction/components/ActionIcon"
import { useActivityLog } from "components/[guild]/activity/ActivityLogContext"
import {
  ACTION,
  ADMIN_ACTIONS,
  ActivityLogActionGroup,
  HIDDEN_ACTIONS,
} from "components/[guild]/activity/constants"
import { HTMLAttributes, useMemo } from "react"
import capitalize from "utils/capitalize"
import Suggestion from "../../Suggestion"
import NoResults from "./NoResults"

type Props = {
  inputValue?: string
  getOptionProps: (props: combobox.OptionProps) => HTMLAttributes<HTMLElement>
}

const ACTIVITY_LOG_ACTIONS = Object.entries(ACTION)
  .filter(([actionType]) => !HIDDEN_ACTIONS.includes(ACTION[actionType]))
  .map(([, actionName]) => actionName)

// TODO: Only filter if needed, doesnt need to filter for admin actions on user activity page
const ActionSuggestons = ({ inputValue, getOptionProps }: Props): JSX.Element => {
  const { actionGroup, withActionGroups } = useActivityLog()

  const actionSuggestions = useMemo(
    () =>
      ACTIVITY_LOG_ACTIONS.filter((action) => {
        const lowerCaseInputValue = inputValue.toLowerCase()

        const isInputMatch = action.toLowerCase().includes(lowerCaseInputValue)
        if (!withActionGroups) return isInputMatch

        const isInGroup =
          actionGroup === ActivityLogActionGroup.AdminAction
            ? ADMIN_ACTIONS.includes(action)
            : !ADMIN_ACTIONS.includes(action)

        return isInputMatch && isInGroup
      }),
    [inputValue, actionGroup]
  )

  return (
    <>
      {!actionSuggestions.length ? (
        <NoResults />
      ) : (
        actionSuggestions.map((action) => (
          <Suggestion
            key={action}
            label="Action"
            {...getOptionProps({
              label: capitalize(action),
              value: action,
            })}
          >
            <Text as="span" isTruncated>
              {action}
            </Text>
            <ActionIcon action={action} size={6} />
          </Suggestion>
        ))
      )}
    </>
  )
}

export default ActionSuggestons
