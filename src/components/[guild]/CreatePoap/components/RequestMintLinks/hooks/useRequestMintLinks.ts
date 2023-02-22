import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { RequestMintLinksForm } from "types"
import fetcher from "utils/fetcher"

const requestMintLinks = (data: RequestMintLinksForm) =>
  fetcher("/api/poap/request-mint-links", { body: data })

const useRequestMintLinks = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmit<RequestMintLinksForm, any>(requestMintLinks, {
    onError: (error) => showErrorToast(error?.error ?? "An error occurred"),
    onSuccess: () => {
      toast({
        title: "Successfully requested mint links!",
        status: "success",
      })
    },
  })
}

export default useRequestMintLinks
