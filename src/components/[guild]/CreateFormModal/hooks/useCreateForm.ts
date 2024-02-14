import useForms from "components/[guild]/hooks/useForms"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import { Form } from "../schemas"

const useCreateForm = (onSuccess?: (createdForm: Form) => void) => {
  const { id } = useGuild()
  const { mutate: mutateForms } = useForms()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<Form>(
    (signedValidation: SignedValidation) =>
      fetcher(`/v2/guilds/${id}/forms`, signedValidation),
    {
      onSuccess: (createdForm) => {
        toast({
          status: "success",
          title: "Successfully created form",
        })

        onSuccess?.(createdForm)

        mutateForms((prevValue) => [...(prevValue ?? []), createdForm], {
          revalidate: false,
        })
      },
      onError: (error) => showErrorToast(error),
    }
  )
}

export default useCreateForm
