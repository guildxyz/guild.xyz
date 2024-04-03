import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const verifyCaptcha = ({ callback, token }: { callback: string; token: string }) =>
  fetcher(callback, {
    body: {
      token,
    },
  })

const useVerifyCaptcha = (onSuccess?: () => void) => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  return useSubmit(verifyCaptcha, {
    onError: (error) => {
      const errorMsg = "Couldn't verify CAPTCHA"
      const correlationId = error.correlationId
      showErrorToast(correlationId ? { error: errorMsg, correlationId } : errorMsg)
    },
    onSuccess: () => {
      onSuccess?.()
      toast({
        status: "success",
        title: "Successful verification",
      })
    },
  })
}

export default useVerifyCaptcha
