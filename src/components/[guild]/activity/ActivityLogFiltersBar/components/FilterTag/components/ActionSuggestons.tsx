import { Text } from "@chakra-ui/react"
import * as combobox from "@zag-js/combobox"
import ActionIcon from "components/[guild]/activity/ActivityLogAction/components/ActionIcon"
import { ACTION } from "components/[guild]/activity/constants"
import { HTMLAttributes, useMemo } from "react"
import capitalize from "utils/capitalize"
import Suggestion from "../../Suggestion"
import NoResults from "./NoResults"

type Props = {
  inputValue?: string
  getOptionProps: (props: combobox.OptionProps) => HTMLAttributes<HTMLElement>
}

const HIDDEN_ACTIONS: (keyof typeof ACTION)[] = [
  "UpdateUrlName",
  "UpdateLogoOrTitle",
  "UpdateDescription",
  "UpdateLogic",
  "UpdateTheme",
]

const ACTIVITY_LOG_ACTIONS = Object.entries(ACTION)
  .filter(([actionType]) => !HIDDEN_ACTIONS.includes(ACTION[actionType]))
  .map(([, actionName]) => actionName)

const ActionSuggestons = ({ inputValue, getOptionProps }: Props): JSX.Element => {
  const actionSuggestions = useMemo(
    () =>
      ACTIVITY_LOG_ACTIONS.filter((action) => {
        const lowerCaseInputValue = inputValue.toLowerCase()
        return (
          action.includes(lowerCaseInputValue) ||
          "action".includes(lowerCaseInputValue)
        )
      }),
    [inputValue]
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
