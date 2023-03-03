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

  return useSubmit(verifycCaptcha, {
    onError: () => showErrorToast("Couldn't verify CAPTCHA"),
    onSuccess: () =>
      toast({
        status: "success",
        title: "Successful verification",
      }),
  })
}

export default useVerifyCaptcha
