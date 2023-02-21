import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { VoiceRequirementParams } from "types"
import fetcher from "utils/fetcher"
import usePoapEventDetails from "./usePoapEventDetails"

const editVoiceRequirement = (signedValdation: SignedValdation) =>
  fetcher("/assets/poap/setVoiceRequirement", {
    method: "PATCH",
    ...signedValdation,
  })

const useEditVoiceRequirement = ({ onSuccess }: UseSubmitOptions = {}) => {
  const { mutatePoapEventDetails } = usePoapEventDetails()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<VoiceRequirementParams>(editVoiceRequirement, {
    onError: (error) => showErrorToast(error),
    onSuccess: () => {
      mutatePoapEventDetails()
      toast({
        status: "success",
        title: "Success",
        description: "Successfully modified voice requirement",
      })
      onSuccess?.()
    },
  })
}

export default useEditVoiceRequirement
