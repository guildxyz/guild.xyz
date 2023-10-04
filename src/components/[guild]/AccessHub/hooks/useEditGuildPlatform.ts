import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { GuildPlatform } from "types"
import fetcher from "utils/fetcher"

const useEditGuildPlatform = ({
  guildPlatformId,
  onSuccess,
}: {
  guildPlatformId: number
  onSuccess?: () => void
}) => {
  const { id, mutateGuild } = useGuild()

  const showErrorToast = useShowErrorToast()

  const submit = async (signedValidation: SignedValdation) =>
    fetcher(`/v2/guilds/${id}/guild-platforms/${guildPlatformId}`, {
      method: "PUT",
      ...signedValidation,
    })

  return useSubmitWithSign<GuildPlatform>(submit, {
    onSuccess: (response) => {
      onSuccess?.()

      mutateGuild(
        (prevGuild) => ({
          ...prevGuild,
          guildPlatforms: prevGuild.guildPlatforms.map((gp) => {
            if (gp.id === guildPlatformId) return response
            return gp
          }),
        }),
        { revalidate: false }
      )
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useEditGuildPlatform
