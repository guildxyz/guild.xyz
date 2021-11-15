import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"

type Data = {
  deleteFromDiscord?: boolean
}

const useDelete = (type: "hall" | "guild", id: number) => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const router = useRouter()

  const submit = async (data: Data) =>
    fetch(
      `${process.env.NEXT_PUBLIC_API}/${type === "hall" ? "group" : "guild"}/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    )

  return useSubmitWithSign<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: `${type === "hall" ? "Hall" : "Guild"} deleted!`,
        description: "You're being redirected to the home page",
        status: "success",
      })
      mutate(type === "hall" ? "/group" : "/guild")
      router.push("/")
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useDelete
