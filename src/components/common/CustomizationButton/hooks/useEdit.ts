import usePersonalSign from "hooks/usePersonalSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"

type Data = {
  themeMode: string
  themeColor: string
}

const useEdit = (type: "group" | "guild", id: number, onClose?: () => void) => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { addressSignedMessage } = usePersonalSign()

  const submit = (data: Data) =>
    fetch(`${process.env.NEXT_PUBLIC_API}/${type}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addressSignedMessage, ...data }),
    })

  return useSubmit<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: `${type === "group" ? "Group" : "Guild"} successfully updated!`,
        status: "success",
        duration: 4000,
      })
      if (onClose) onClose()
      // temporary until there's no SWR for single guild data
      mutate(type === "group" ? "groups" : "guilds")
    },
    onError: (error) => {
      if (!error) return
      if (error instanceof Error) showErrorToast(error.message)
      else showErrorToast(error.errors)
    },
  })
}

export default useEdit
