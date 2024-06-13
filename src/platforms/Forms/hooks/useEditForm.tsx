import { Schemas } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildForms from "components/[guild]/hooks/useGuildForms"
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
  const { mutate } = useGuildForms()

  const showErrorToast = useShowErrorToast()

  const editForm = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/guilds/${id}/forms/${formId}`, {
      method: "PUT",
      ...signedValidation,
    })

  return useSubmitWithSign<Schemas["Form"]>(editForm, {
    onSuccess: (response) => {
      onSuccess?.()

      mutate(
        (prevForms) =>
          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          prevForms.map((form) => {
            // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
