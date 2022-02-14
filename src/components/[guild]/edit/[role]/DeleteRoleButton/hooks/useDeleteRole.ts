import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
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

  const submit = async (data: Data) =>
    fetcher(`/role/${roleId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

  return useSubmitWithSign<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: `Role deleted!`,
        status: "success",
      })

      mutate(`/guild/urlName/${guild?.urlName}`)
      mutate("/guild?sort=members")
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useDeleteRole
