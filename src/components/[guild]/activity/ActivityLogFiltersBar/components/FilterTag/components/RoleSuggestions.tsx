import * as combobox from "@zag-js/combobox"
import RoleTag from "components/[guild]/activity/ActivityLogAction/components/RoleTag"
import useGuild from "components/[guild]/hooks/useGuild"
import { HTMLAttributes, useMemo } from "react"
import Suggestion from "../../Suggestion"
import NoResults from "./NoResults"

type Props = {
  inputValue?: string
  getOptionProps: (props: combobox.OptionProps) => HTMLAttributes<HTMLElement>
}

const RoleSuggestions = ({ inputValue, getOptionProps }: Props): JSX.Element => {
  const { id: guildId, roles } = useGuild()

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
              <RoleTag roleId={roleSuggestion.id} guildId={guildId} />
            </Suggestion>
          )
        })
      )}
    </>
  )
}
export default RoleSuggestions
