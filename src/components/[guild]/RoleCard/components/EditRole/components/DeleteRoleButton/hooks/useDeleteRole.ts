import useGuild from "components/[guild]/hooks/useGuild"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type Data = {
  removePlatformAccess?: number
}

const useDeleteRole = (roleId: number) => {
  const { mutateGuild } = useGuild()
  const matchMutate = useMatchMutate()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = async ({ validation, data }: WithValidation<Data>) =>
    fetcher(`/role/${roleId}`, {
      method: "DELETE",
      body: data,
      validation,
    })

  return useSubmitWithSign<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: `Role deleted!`,
        status: "success",
      })

      mutateGuild()
      matchMutate(/^\/guild\?order/)
    },
    onError: (error) => showErrorToast(error),
    forcePrompt: true,
  })
}

export default useDeleteRole
