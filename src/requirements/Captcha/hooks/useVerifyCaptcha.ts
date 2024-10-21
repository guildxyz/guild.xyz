import { useErrorToast } from "@/components/ui/hooks/useErrorToast"
import { useToast } from "@/components/ui/hooks/useToast"
import useSubmit from "hooks/useSubmit"
import fetcher from "utils/fetcher"

const verifyCaptcha = (
  { callback, token }: { callback: string; token: string } = {
    callback: "",
    token: "",
  }
) => {
  if (!callback) throw new Error("Invalid or missing callback")
  if (!token) throw new Error("Invalid or missing token")

  return fetcher(callback, {
    body: {
      token,
    },
  })
}

const useVerifyCaptcha = (onSuccess?: () => void) => {
  const errorToast = useErrorToast()
  const { toast } = useToast()

  return useSubmit(verifyCaptcha, {
    onError: (error) => {
      const errorMsg = "Couldn't verify CAPTCHA"
      const correlationId = error.correlationId
      errorToast(correlationId ? { error: errorMsg, correlationId } : errorMsg)
    },
    onSuccess: () => {
      onSuccess?.()
      toast({
        variant: "success",
        title: "Successful verification",
      })
    },
  })
}

export default useVerifyCaptcha
