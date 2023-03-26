import useAccess from "components/[guild]/hooks/useAccess"
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

const useVerifyCaptcha = () => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { mutate } = useAccess()

  return useSubmit(verifyCaptcha, {
    onError: () => showErrorToast("Couldn't verify CAPTCHA"),
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
