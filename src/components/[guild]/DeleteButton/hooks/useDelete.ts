import useShowErrorToast from "components/create-guild/hooks/useShowErrorToast"
import { useGuild } from "components/[guild]/Context"
import usePersonalSign from "hooks/usePersonalSign"
import useSubmitMachine from "hooks/useSubmitMachine"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"

type Data = {
  deleteFromDiscord?: boolean
}

const useDelete = () => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { addressSignedMessage } = usePersonalSign()
  const { id } = useGuild()
  const router = useRouter()

  const submit = async (data: Data) =>
    fetch(`${process.env.NEXT_PUBLIC_API}/community/guilds/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addressSignedMessage,
        ...data,
      }),
    })

  return useSubmitMachine<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: "Guild deleted!",
        description: "You're being redirected to the home page",
        status: "success",
        duration: 4000,
      })
      mutate("guilds")
      router.push("/")
    },
    onError: (error) => {
      if (error instanceof Error) showErrorToast(error.message)
      else showErrorToast(error.errors)
    },
  })
}

export default useDelete
