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
        title: `${type === "group" ? "Group" : "Guild"} deleted!`,
        description: "You're being redirected to the home page",
        status: "success",
        duration: 4000,
      })
      mutate(type === "group" ? "groups" : "guilds")
      router.push("/")
    },
    onError: (error) => {
      if (error instanceof Error) showErrorToast(error.message)
      else showErrorToast(error.errors)
    },
  })
}

export default useDelete
