import useShowErrorToast from "components/create-guild/hooks/useShowErrorToast"
import useSWRSubmit from "components/index/hooks/useSWRSubmit"
import { useGuild } from "components/[guild]/Context"
import usePersonalSign from "hooks/usePersonalSign"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"

const fetchDelete = async (_, addressSignedMessage, id, deleteFromDiscord) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/community/guilds/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      deleteFromDiscord,
      addressSignedMessage,
    }),
  })

const useDelete = (deleteFromDiscord = true) => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { addressSignedMessage } = usePersonalSign()
  const { id } = useGuild()
  const router = useRouter()

  const { isLoading, onSubmit, error } = useSWRSubmit(
    ["delete", addressSignedMessage, id, deleteFromDiscord],
    fetchDelete
  )

  const handleSuccess = () => {
    toast({
      title: "Guild deleted!",
      description: "You're being redirected to the home page",
      status: "success",
      duration: 4000,
    })
    mutate("guilds")
    router.push("/")
  }

  const handleError = () => {
    if (error instanceof Error) showErrorToast(error.message)
    else showErrorToast(error.errors)
  }

  return {
    onSubmit: onSubmit(handleSuccess, handleError),
    isLoading,
  }
}

export default useDelete
