import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useDeleteMonetization = (poapContractId: number) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { mutateGuild } = useGuild()

  const deleteMonetization = async (signedValidation: SignedValdation) =>
    fetcher(`/assets/poap/monetize/${poapContractId}`, {
      method: "DELETE",
      ...signedValidation,
    })

  return useSubmitWithSign<any>(deleteMonetization, {
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
