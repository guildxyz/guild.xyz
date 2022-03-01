import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidation } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type Data = { addresses: Array<string> }

const useUpdateUser = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = async ({ validation, data }: WithValidation<Data>) =>
    fetcher("/user", {
      method: "PATCH",
      body: data,
      validation,
    })

  return useSubmitWithSign<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: `Address removed!`,
        status: "success",
      })
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useUpdateUser
