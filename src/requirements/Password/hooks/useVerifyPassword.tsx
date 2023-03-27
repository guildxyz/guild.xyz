import useAccess from "components/[guild]/hooks/useAccess"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const verifyPassword = ({
  callback,
  password,
}: {
  callback: string
  password: string
}) =>
  fetcher(callback.replace("api", "dev"), {
    body: {
      password: password,
      requirementId: 10,
    },
  })

const useVerifyPassword = () => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { mutate } = useAccess()

  return useSubmit(verifyPassword, {
    onError: () => showErrorToast("Couldn't verify password"),
    onSuccess: () => {
      mutate()
      toast({
        status: "success",
        title: "Successful verification",
      })
    },
  })
}

export default useVerifyPassword
