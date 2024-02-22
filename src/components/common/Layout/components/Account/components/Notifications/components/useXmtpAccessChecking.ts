import { useCanMessage } from "@xmtp/react-sdk"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { useAccount } from "wagmi"

export const useXmtpAccessChecking = () => {
  const { canMessageStatic } = useCanMessage()
  const showErrorToast = useShowErrorToast()

  const { address } = useAccount()

  const { error, isLoading, onSubmit, reset, response } = useSubmit(
    async () => canMessageStatic(address),
    {
      onError: () => showErrorToast("Error happened during checking XMTP access"),
    }
  )
  return {
    error,
    isCheckingAccess: isLoading,
    reCheck: onSubmit,
    reset,
    hasAccess: response,
  }
}
