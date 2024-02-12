import { Form } from "components/[guild]/CreateFormModal/schemas"
import useForms from "components/[guild]/hooks/useForms"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"

const useEditForm = ({
  formId,
  onSuccess,
}: {
  formId: number
  onSuccess?: () => void
}) => {
  const { id } = useGuild()
  const { mutate } = useForms()

  const showErrorToast = useShowErrorToast()

  const editForm = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/guilds/${id}/forms/${formId}`, {
      method: "PUT",
      ...signedValidation,
    })

  return useSubmitWithSign<Form>(editForm, {
    onSuccess: (response) => {
      onSuccess?.()

      mutate(
        (prevForms) =>
          prevForms.map((form) => {
            if (form.id !== response.id) return form
            return response
          }),
        { revalidate: false }
      )
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useEditForm
