import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidation } from "hooks/useSubmit/useSubmit"
import fetcher from "utils/fetcher"

type Data = { addresses: Array<string> }

const useUpdateUser = (onSuccess?: () => void) => {
  const showErrorToast = useShowErrorToast()

  const submit = async ({ validation, data }: WithValidation<Data>) =>
    fetcher("/user", {
      method: "PATCH",
      body: data,
      validation,
    })

  return useSubmitWithSign<Data, any>(submit, {
    onSuccess,
    onError: (error) => showErrorToast(error),
  })
}

export default useUpdateUser
