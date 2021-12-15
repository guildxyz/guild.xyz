import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"
import fetcher from "utils/fetcher"

type Data = {
  deleteFromDiscord?: boolean
}

const useDeleteRole = () => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const router = useRouter()

  const guild = useGuild()

  const submit = async (data: Data) =>
    fetcher(`/role/${parseInt(router.query.role.toString())}`, {
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
      router.push(`/${guild?.urlName}`)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useDeleteRole
