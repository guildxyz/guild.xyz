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

const useDelete = (type: "guild" | "role", id: number) => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const router = useRouter()

  const guild = useGuild()

  const submit = async (data: Data) =>
    fetcher(`/${type}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

  return useSubmitWithSign<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: `${type === "guild" ? "Guild" : "Role"} deleted!`,
        description:
          type === "guild" ? "You're being redirected to the home page" : "",
        status: "success",
      })

      if (type === "guild") {
        mutate(`/${type}`)
        router.push("/")
      } else if (guild?.urlName) {
        mutate(`/guild/urlName/${guild.urlName}`)
      }
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useDelete
