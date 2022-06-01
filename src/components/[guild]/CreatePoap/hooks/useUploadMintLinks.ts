import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type UploadMintLinksData = {
  poapId: number
  links: string[]
}

const fetchData = (data: UploadMintLinksData) =>
  fetcher("/assets/poap/links", { body: data })

const useUploadMintLinks = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmit<UploadMintLinksData, any>(fetchData, {
    onError: (error) => showErrorToast(error),
    onSuccess: () =>
      toast({
        title: "Successfuly uploaded mint links!",
        status: "success",
      }),
  })
}

export default useUploadMintLinks
