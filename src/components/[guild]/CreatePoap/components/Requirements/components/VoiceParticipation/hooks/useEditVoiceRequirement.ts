import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { VoiceRequirementParams } from "types"
import fetcher from "utils/fetcher"
import usePoapEventDetails from "./usePoapEventDetails"

const editVoiceRequirement = ({
  validation,
  data: body,
}: WithValidation<VoiceRequirementParams>) =>
  fetcher("/assets/poap/setVoiceRequirement", {
    validation,
    method: "PATCH",
    body,
  })

const useEditVoiceRequirement = () => {
  const { mutatePoapEventDetails } = usePoapEventDetails()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<VoiceRequirementParams, any>(editVoiceRequirement, {
    onError: (error) => showErrorToast(error),
    onSuccess: () => {
      mutatePoapEventDetails()
      toast({
        status: "success",
        title: "Success",
        description: "Successfully modified voice requirement",
      })
    },
  })
}

export default useEditVoiceRequirement
