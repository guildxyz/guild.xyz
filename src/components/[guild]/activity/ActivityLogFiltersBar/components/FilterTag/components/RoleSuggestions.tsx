import * as combobox from "@zag-js/combobox"
import ActivityLogRoleTag from "components/[guild]/activity/ActivityLogAction/components/ActivityLogRoleTag"
import useGuild from "components/[guild]/hooks/useGuild"
import { HTMLAttributes, useMemo } from "react"
import Suggestion from "../../Suggestion"
import NoResults from "./NoResults"

type Props = {
  guildId?: string | number
  inputValue?: string
  getOptionProps: (props: combobox.OptionProps) => HTMLAttributes<HTMLElement>
}

const RoleSuggestions = ({
  guildId,
  inputValue,
  getOptionProps,
}: Props): JSX.Element => {
  const { roles } = useGuild(guildId)

  const roleSuggestions = useMemo(
    () =>
      roles?.filter((role) => {
        const lowerCaseInputValue = inputValue?.trim().toLowerCase()
        return (
          role.name.toLowerCase().includes(lowerCaseInputValue) ||
          "role".includes(lowerCaseInputValue)
        )
      }) ?? [],
    [inputValue, roles]
  )

  return (
    <>
      {!roleSuggestions.length ? (
        <NoResults />
      ) : (
        roleSuggestions.map((roleSuggestion) => {
          const suggestionLabel = "Role"

          return (
            <Suggestion
              key={roleSuggestion.id}
              label={suggestionLabel}
              {...getOptionProps({
                label: suggestionLabel,
                value: roleSuggestion.id.toString(),
              })}
            >
              <ActivityLogRoleTag
                roleId={roleSuggestion.id}
                guildId={Number(guildId)}
              />
            </Suggestion>
          )
        })
      )}
    </>
  )
}
export default RoleSuggestions
