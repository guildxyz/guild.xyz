import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
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
  const { mutate } = useUser()
  const toast = useToast()

  const submit = async ({ validation, data }: WithValidation<Data>) =>
    fetcher("/user/disconnect", {
      method: "POST",
      body: data,
      validation,
    })

  return useSubmitWithSign<Data, any>(submit, {
    onSuccess: () => {
      mutate()

      toast({
        title: `Account disconnected!`,
        status: "success",
      })

      onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useDisconnect
