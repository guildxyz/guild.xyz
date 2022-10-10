import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { VoiceRequirementParams } from "types"
import fetcher from "utils/fetcher"
import usePoapEventDetails from "./usePoapEventDetails"

const setVoiceRequirement = ({
  validation,
  data: body,
}: WithValidation<VoiceRequirementParams>) =>
  fetcher("/assets/poap/setVoiceRequirement", {
    validation,
    body,
  })

const useSetVoiceRequirement = () => {
  const { mutatePoapEventDetails } = usePoapEventDetails()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<VoiceRequirementParams, any>(setVoiceRequirement, {
    onError: (error) => showErrorToast(error),
    onSuccess: () => {
      mutatePoapEventDetails()
      toast({
        status: "success",
        title: "Successful event setup!",
      })
    },
  })
}

export default useSetVoiceRequirement
