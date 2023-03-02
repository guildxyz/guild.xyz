import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { CreatedPoapData } from "types"
import fetcher from "utils/fetcher"

const updatePoap = async (data: CreatedPoapData) =>
  fetcher(`/api/poap/fancyId`, {
    method: "PUT",
    body: data,
  })

const useUpdatePoap = ({ onSuccess }: UseSubmitOptions) => {
  const showErrorToast = useShowErrorToast()

  const { onSubmit, ...rest } = useSubmit<CreatedPoapData, any>(updatePoap, {
    onError: (error) => showErrorToast(error?.error?.message ?? error?.error),
    onSuccess,
  })

  return {
    onSubmit: (data) => {
      delete data.image
      delete data.image_url
      return onSubmit(data)
    },
    ...rest,
  }
}

export default useUpdatePoap
