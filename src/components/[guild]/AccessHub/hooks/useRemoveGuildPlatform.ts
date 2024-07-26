import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/types"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useRemoveGuildPlatform = (
  guildPlatformId: number,
  { onSuccess, onError }: UseSubmitOptions<any> = {}
) => {
  const { id, mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/guilds/${id}/guild-platforms/${guildPlatformId}`, {
      method: "DELETE",
      ...signedValidation,
    })

  return useSubmitWithSign<any>(submit, {
    forcePrompt: true,
    onSuccess: (res) => {
      toast({
        title: "Reward removed!",
        status: "success",
      })

      mutateGuild(
        (prevGuild) => ({
          ...prevGuild,
          guildPlatforms:
            prevGuild.guildPlatforms?.filter(
              (prevGuildPlatform) => prevGuildPlatform.id !== guildPlatformId
            ) ?? [],
          roles:
            prevGuild.roles?.map((prevRole) => ({
              ...prevRole,
              rolePlatforms:
                prevRole.rolePlatforms?.filter(
                  (prevRolePlatform) =>
                    prevRolePlatform.guildPlatformId !== guildPlatformId
                ) ?? [],
            })) ?? [],
        }),
        { revalidate: false }
      )
      onSuccess?.(res)
    },
    onError: (error) => {
      showErrorToast(error)
      onError?.(error)
    },
  })
}

export default useRemoveGuildPlatform
