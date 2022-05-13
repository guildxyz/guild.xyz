import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import { User } from "types"
import fetcher from "utils/fetcher"

type Data = Partial<User>

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
