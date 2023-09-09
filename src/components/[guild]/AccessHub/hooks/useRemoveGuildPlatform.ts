import useGuild from "components/[guild]/hooks/useGuild"
import useGateables from "hooks/useGateables"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useRemoveGuildPlatform = (guildPlatformId: number) => {
  const { id, guildPlatforms, mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { mutate: mutateGateables } = useGateables(
    guildPlatforms?.find((gp) => gp.id === guildPlatformId)?.platformId
  )

  const submit = async (signedValidation: SignedValdation) =>
    fetcher(`/v2/guilds/${id}/guild-platforms/${guildPlatformId}`, {
      method: "DELETE",
      ...signedValidation,
    })

  return useSubmitWithSign<any>(submit, {
    forcePrompt: true,
    onSuccess: () => {
      toast({
        title: `Platform removed!`,
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

      mutateGateables()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useRemoveGuildPlatform
