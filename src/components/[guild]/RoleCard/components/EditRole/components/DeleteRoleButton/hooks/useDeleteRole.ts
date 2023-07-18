import useGuild from "components/[guild]/hooks/useGuild"
import useIsV2 from "hooks/useIsV2"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type Data = {
  removePlatformAccess?: boolean
}

const useDeleteRole = (roleId: number, onSuccess?: () => void) => {
  const { mutateGuild, id } = useGuild()
  const matchMutate = useMatchMutate()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const isV2 = useIsV2()

  const submit = async (signedValidation: SignedValdation) =>
    fetcher(isV2 ? `/v2/guilds/${id}/roles/${roleId}` : `/role/${roleId}`, {
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

      if (isV2) {
        mutateGuild(
          (prev) => ({
            ...prev,
            roles: prev?.roles?.filter((role) => role.id !== roleId) ?? [],
          }),
          { revalidate: false }
        )
      } else {
        mutateGuild()
        matchMutate(/^\/guild\?order/)
      }

      // matchMutate(/^\/guild\?order/)
    },
    onError: (error) => showErrorToast(error),
    forcePrompt: true,
  })
}

export default useDeleteRole
