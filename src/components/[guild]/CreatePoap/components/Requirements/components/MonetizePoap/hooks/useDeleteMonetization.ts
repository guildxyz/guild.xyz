import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useDeleteMonetization = (poapContractId: number) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { mutateGuild } = useGuild()

  const deleteMonetization = async () =>
    fetcher(`/assets/poap/monetize/${poapContractId}`, {
      method: "DELETE",
    })

  return useSubmit<null, any>(deleteMonetization, {
    onError: (e) => showErrorToast(e),
    onSuccess: () => {
      mutateGuild()
      toast({
        title: "Successfully deleted monetization",
        status: "success",
      })
    },
  })
}

export default useDeleteMonetization
