import { Schemas } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildForms from "components/[guild]/hooks/useGuildForms"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useCreateForm = (onSuccess?: (createdForm: Schemas["Form"]) => void) => {
  const { id } = useGuild()
  const { mutate: mutateForms } = useGuildForms()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<Schemas["Form"] & { submissionCount: number }>(
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
