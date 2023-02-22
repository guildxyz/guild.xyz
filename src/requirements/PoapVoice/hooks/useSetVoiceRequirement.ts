import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { VoiceRequirementParams } from "types"
import fetcher from "utils/fetcher"
import usePoapEventDetails from "./usePoapEventDetails"

type Method = "POST" | "PATCH"

const setVoiceRequirement =
  (method: Method) => (signedValidation: SignedValdation) =>
    fetcher("/assets/poap/setVoiceRequirement", {
      method,
      ...signedValidation,
    })

const useSetVoiceRequirement = (
  method: Method,
  { onSuccess }: UseSubmitOptions = {}
) => {
  const { mutatePoapEventDetails } = usePoapEventDetails()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<VoiceRequirementParams>(setVoiceRequirement(method), {
    onError: (error) => showErrorToast(error),
    onSuccess: () => {
      mutatePoapEventDetails()
      toast({
        status: "success",
        title: `Successfully ${
          method === "POST" ? "added" : "modified"
        } voice requirement`,
      })
      onSuccess?.()
    },
  })
}

export default useSetVoiceRequirement
