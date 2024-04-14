import * as combobox from "@zag-js/combobox"
import RewardTag from "components/[guild]/activity/ActivityLogAction/components/RewardTag"
import useGuild from "components/[guild]/hooks/useGuild"
import { HTMLAttributes, useMemo } from "react"
import { PlatformName, PlatformType } from "types"
import Suggestion from "../../Suggestion"
import NoResults from "./NoResults"

type Props = {
  guildId?: string | number
  inputValue?: string
  getOptionProps: (props: combobox.OptionProps) => HTMLAttributes<HTMLElement>
}

const RewardSuggestions = ({
  guildId,
  inputValue,
  getOptionProps,
}: Props): JSX.Element => {
  const { roles, guildPlatforms } = useGuild(guildId)

  const allRewardSuggestions = useMemo(
    () =>
      !roles || !guildPlatforms
        ? []
        : roles
            .flatMap((role) => role.rolePlatforms)
            .map((rp) => {
              const role = roles.find((r) => r.id === rp.roleId)
              const guildPlatform = guildPlatforms.find(
                (gp) => gp.id === rp.guildPlatformId
              )
              const name =
                guildPlatform?.platformGuildName ??
                guildPlatform?.platformGuildData?.name

              return {
                rolePlatformId: rp.id,
                platformName: PlatformType[
                  guildPlatform?.platformId
                ] as PlatformName,
                name:
                  guildPlatform?.platformId === PlatformType.DISCORD
                    ? `${role.name} - ${name}`
                    : name,
                roleId: role.id,
              }
            }),
    [roles, guildPlatforms]
  )

  const rewardSuggestions = useMemo(
    () =>
      allRewardSuggestions.filter((reward) => {
        const lowerCaseInputValue = inputValue?.trim().toLowerCase()

        if (!lowerCaseInputValue) return true

        return (
          reward.name?.toLowerCase()?.includes(lowerCaseInputValue) ||
          "reward".includes(lowerCaseInputValue)
        )
      }) ?? [],
    [allRewardSuggestions, inputValue]
  )

  return (
    <>
      {!rewardSuggestions.length ? (
        <NoResults />
      ) : (
        rewardSuggestions.map((rewardSuggestion) => {
          const suggestionLabel = "Reward"

          return (
            <Suggestion
              key={rewardSuggestion.rolePlatformId}
              label={suggestionLabel}
              {...getOptionProps({
                label: suggestionLabel,
                value: rewardSuggestion.rolePlatformId.toString(),
              })}
            >
              <RewardTag
                rolePlatformId={rewardSuggestion.rolePlatformId}
                roleId={rewardSuggestion.roleId}
                platformType={rewardSuggestion.platformName}
                label={rewardSuggestion.name}
              />
            </Suggestion>
          )
        })
      )}
    </>
  )
}
export default RewardSuggestions
