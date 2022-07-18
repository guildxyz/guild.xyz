import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import { PlatformName } from "types"
import fetcher from "utils/fetcher"

type Data =
  | {
      platformName: PlatformName
    }
  | {
      address: string
    }

const useDisconnect = (onSuccess?: () => void) => {
  const showErrorToast = useShowErrorToast()

  const submit = async ({ validation, data }: WithValidation<Data>) =>
    fetcher("/user/disconnect", {
      method: "POST",
      body: data,
      validation,
    })

  return useSubmitWithSign<Data, any>(submit, {
    onSuccess,
    onError: (error) => showErrorToast(error),
  })
}

export default useDisconnect
