import usePersonalSign from "hooks/usePersonalSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"

type Data = {
  deleteFromDiscord?: boolean
}

const useDelete = (type: "group" | "guild", id: number) => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { addressSignedMessage } = usePersonalSign()
  const router = useRouter()

  const submit = async (data: Data) =>
    fetch(`${process.env.NEXT_PUBLIC_API}/${type}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addressSignedMessage,
        ...data,
      }),
    })

  return useSubmit<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: `${type === "group" ? "Hall" : "Guild"} deleted!`,
        description: "You're being redirected to the home page",
        status: "success",
      })
      mutate(type === "group" ? "groups" : "guilds")
      router.push("/")
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useDelete
