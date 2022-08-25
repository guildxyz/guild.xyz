import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { CreatedPoapData } from "types"
import fetcher from "utils/fetcher"

const updatePoap = async (data: CreatedPoapData) =>
  fetcher(`/api/poap/fancyId`, {
    method: "PUT",
    body: data,
  })

const useUpdatePoap = () => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  return useSubmit<CreatedPoapData, string>(updatePoap, {
    onError: (error) => showErrorToast(error?.error?.message ?? error?.error),
    // TODO: we probably won't need a success message here
    onSuccess: () =>
      toast({
        status: "success",
        title: "Successfully updated POAP",
      }),
  })
}

export default useUpdatePoap
