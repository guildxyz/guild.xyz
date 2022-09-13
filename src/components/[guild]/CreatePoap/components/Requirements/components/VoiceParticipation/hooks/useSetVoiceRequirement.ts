import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { VoiceRequirement } from "types"
import fetcher from "utils/fetcher"

type SetVoiceRequirementParams = {
  poapId: number
  voiceChannelId: string
  voiceRequirement: VoiceRequirement
}

const setVoiceRequirements = ({
  validation,
  data: body,
}: WithValidation<SetVoiceRequirementParams>) =>
  fetcher("/assets/poap/setVoiceRequirement", {
    validation,
    body,
  })

const useSetVoiceRequirement = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<SetVoiceRequirementParams, any>(setVoiceRequirements, {
    onError: (error) => showErrorToast(error),
    onSuccess: () =>
      toast({
        status: "success",
        title: "Successful event setup!",
      }),
  })
}

export default useSetVoiceRequirement
