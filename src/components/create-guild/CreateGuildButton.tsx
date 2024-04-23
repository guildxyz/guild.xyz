import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import useCreateGuild from "./hooks/useCreateGuild"

type Props = {
  isDisabled?: boolean
}

const CreateGuildButton = ({ isDisabled }: Props): JSX.Element => {
  const { handleSubmit } = useFormContext<GuildFormType>()
  const roles = useWatch({ name: "roles" })
  const guildPlatforms = useWatch({ name: "guildPlatforms" })
  const hasDiscordReward = guildPlatforms?.some(
    (guildPlatform) => guildPlatform?.platformName === "DISCORD"
  )
  const { captureEvent } = usePostHogContext()

  const { onSubmit, isLoading, response, isSigning, signLoadingText } =
    useCreateGuild({
      onSuccess: () => {
        if (hasDiscordReward) {
          captureEvent("[discord setup] guild creation successful")
        }
      },
      onError: (err) => {
        captureEvent("[discord setup] guild creation failed", { error: err })
      },
    })

  return (
    <Button
      flexShrink={0}
      colorScheme="green"
      isDisabled={response || isLoading || isSigning || isDisabled}
      isLoading={isLoading || isSigning}
      loadingText={signLoadingText || "Saving data"}
      onClick={() => {
        if (hasDiscordReward) {
          captureEvent("[discord setup] clicked create guild button")
        }
        captureEvent("guild creation flow > templates selected", {
          roles: roles.map((role) => role.name),
        })
        captureEvent("guild creation flow > number of platforms added", {
          platformConnected: roles.reduce(
            (acc, current) => acc + current.rolePlatforms?.length,
            0
          ),
        })
        handleSubmit(onSubmit)()
      }}
      data-test="create-guild-button"
    >
      Create Guild
    </Button>
  )
}

export default CreateGuildButton
