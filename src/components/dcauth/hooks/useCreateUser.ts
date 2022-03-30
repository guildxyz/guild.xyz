import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import fetcher from "utils/fetcher"

type RequestBody = { address: string }

const useCreateUser = (onSuccess?: () => void) => {
  const showErrorToast = useShowErrorToast()

  const submit = async (body: RequestBody) =>
    fetcher("/user", {
      method: "POST",
      body,
    })

  return useSubmit<RequestBody, any>(submit, {
    onSuccess,
    onError: (error) => showErrorToast(error),
  })
}

export default useCreateUser
