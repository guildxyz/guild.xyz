import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { GuildPoap } from "types"
import fetcher from "utils/fetcher"

type UpdatePoapData = { id: number; expiryDate: number }

const updateGuildPoap = async (data: UpdatePoapData) =>
  fetcher(`/assets/poap`, {
    method: "PATCH",
    body: data,
  })

const useUpdateGuildPoap = () => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  return useSubmit<UpdatePoapData, GuildPoap>(updateGuildPoap, {
    onError: (error) => showErrorToast(error?.error?.message ?? error?.error),
    onSuccess: () =>
      toast({
        status: "success",
        title: "Successfully updated POAP",
      }),
  })
}

export default useUpdateGuildPoap
