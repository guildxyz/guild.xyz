import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
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

  const submit = async (signedValidation: SignedValdation) =>
    fetcher("/user/disconnect", {
      method: "POST",
      ...signedValidation,
    })

  return useSubmitWithSign<any>(submit, {
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
