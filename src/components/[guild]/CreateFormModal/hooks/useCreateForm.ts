import useForms from "components/[guild]/hooks/useForms"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import { Form } from "../schemas"

const useCreateForm = (params?: { onSuccess?: () => void }) => {
  const { id } = useGuild()
  const { mutate: mutateForms } = useForms()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<Form>(
    (signedValidation: SignedValdation) =>
      fetcher(`/v2/guilds/${id}/forms`, signedValidation),
    {
      onSuccess: (createdForm) => {
        toast({
          status: "success",
          title: "Successfully created form",
        })

        params?.onSuccess?.()

        mutateForms((prevValue) => [...(prevValue ?? []), createdForm])
      },
      onError: (error) => showErrorToast(error),
    }
  )
}

export default useCreateForm
