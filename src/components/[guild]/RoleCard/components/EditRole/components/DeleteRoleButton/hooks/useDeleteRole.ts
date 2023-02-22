import useGuild from "components/[guild]/hooks/useGuild"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type Data = {
  removePlatformAccess?: boolean
}

const useDeleteRole = (roleId: number, onSuccess?: () => void) => {
  const { mutateGuild } = useGuild()
  const matchMutate = useMatchMutate()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = async (signedValidation: SignedValdation) =>
    fetcher(`/role/${roleId}`, {
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

      mutateGuild()
      matchMutate(/^\/guild\?order/)
    },
    onError: (error) => showErrorToast(error),
    forcePrompt: true,
  })
}

export default useDeleteRole
