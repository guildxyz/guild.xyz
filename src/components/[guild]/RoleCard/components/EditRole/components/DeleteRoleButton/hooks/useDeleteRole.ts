import useGuild from "components/[guild]/hooks/useGuild"
import { useYourGuilds } from "components/explorer/YourGuilds"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useDeleteRole = (roleId: number, onSuccess?: () => void) => {
  const { mutateGuild, id } = useGuild()
  const { mutate: mutateYourGuilds } = useYourGuilds()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/guilds/${id}/roles/${roleId}`, {
      method: "DELETE",
      ...signedValidation,
    })

  return useSubmitWithSign<any>(submit, {
    onSuccess: () => {
      toast({
        title: `Role deleted!`,
        status: "success",
      })
      onSuccess?.()

      mutateGuild(
        (prev) => ({
          ...prev,
          roles: prev?.roles?.filter((role) => role.id !== roleId) ?? [],
        }),
        { revalidate: false }
      )

      mutateYourGuilds(
        (prev) =>
          prev?.map((guild) => {
            if (guild.id !== id) return guild
            return {
              ...guild,
              rolesCount: guild.rolesCount - 1,
            }
          }),
        {
          revalidate: false,
        }
      )

      // TODO: add mutateGuilds
    },
    onError: (error) => showErrorToast(error),
    forcePrompt: true,
  })
}

export default useDeleteRole
