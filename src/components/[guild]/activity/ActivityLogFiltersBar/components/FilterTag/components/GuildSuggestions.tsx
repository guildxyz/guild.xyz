import * as combobox from "@zag-js/combobox"
import { useYourGuilds } from "components/explorer/YourGuilds"
import GuildTag from "components/[guild]/activity/ActivityLogAction/components/GuildTag"
import { HTMLAttributes } from "react"
import { useActivityLogFilters } from "../../ActivityLogFiltersContext"
import Suggestion from "../../Suggestion"
import NoResults from "./NoResults"

type Props = {
  inputValue?: string
  getOptionProps: (props: combobox.OptionProps) => HTMLAttributes<HTMLElement>
}

const GuildSuggestions = ({ inputValue, getOptionProps }: Props): JSX.Element => {
  const { data } = useYourGuilds()
  const { activeFilters } = useActivityLogFilters()

  const activeGuildFilters = activeFilters
    ?.filter((f) => f.filter === "guildId")
    .map((f) => f.value)

  const guildSuggestions =
    data
      ?.filter((g) => !activeGuildFilters?.includes(g.id.toString()))
      .filter((g) =>
        g.name.toLowerCase().includes(inputValue?.trim().toLowerCase())
      ) ?? []

  return (
    <>
      {!guildSuggestions.length ? (
        <NoResults />
      ) : (
        guildSuggestions.map((guildSuggestion) => {
          const suggestionLabel = "Guild"

          return (
            <Suggestion
              key={guildSuggestion.id}
              label={suggestionLabel}
              {...getOptionProps({
                label: suggestionLabel,
                value: guildSuggestion.id.toString(),
              })}
            >
              <GuildTag guildId={guildSuggestion.id} />
            </Suggestion>
          )
        })
      )}
    </>
  )
}
export default GuildSuggestions
