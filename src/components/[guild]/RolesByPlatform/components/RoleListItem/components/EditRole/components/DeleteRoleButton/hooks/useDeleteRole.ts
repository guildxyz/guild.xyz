import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidation } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import fetcher from "utils/fetcher"

type Data = {
  deleteFromDiscord?: boolean
}

const useDeleteRole = (roleId: number) => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const guild = useGuild()

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

      mutate([`/guild/${guild?.urlName}`, undefined])
      mutate("/guild?sort=members")
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useDeleteRole
