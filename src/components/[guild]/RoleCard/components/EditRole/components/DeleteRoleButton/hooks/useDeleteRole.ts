import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type Data = {
  removePlatformAccess?: boolean
}

const useDeleteRole = (roleId: number, onSuccess?: () => void) => {
  const { mutateGuild, id } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = async (signedValidation: SignedValdation) =>
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

      // matchMutate(/^\/guild\?order/)
    },
    onError: (error) => showErrorToast(error),
    forcePrompt: true,
  })
}

export default useDeleteRole
