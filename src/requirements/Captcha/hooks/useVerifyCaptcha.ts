import useAccess from "components/[guild]/hooks/useAccess"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const verifycCaptcha = ({ callback, token }: { callback: string; token: string }) =>
  fetcher(callback, {
    body: {
      token,
    },
  })

const useVerifyCaptcha = () => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { mutate } = useAccess()

  return useSubmit(verifycCaptcha, {
    onError: (error) => {
      const errorMsg = "Couldn't verify CAPTCHA"
      const correlationId = error.correlationId
      showErrorToast(correlationId ? { error: errorMsg, correlationId } : errorMsg)
    },
    onSuccess: () => {
      mutate()
      toast({
        status: "success",
        title: "Successful verification",
      })
    },
  })
}

export default useVerifyCaptcha
