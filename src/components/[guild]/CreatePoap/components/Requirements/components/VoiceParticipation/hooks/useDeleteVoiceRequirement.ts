import useVoiceParticipants from "components/[guild]/CreatePoap/components/Distribution/components/ManageEvent/components/EligibleMembers/hooks/useVoiceParticipants"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import usePoapEventDetails from "./usePoapEventDetails"

type DeleteVoiceRequirementParams = {
  poapId: number
}

const setVoiceRequirement = ({
  validation,
  data: body,
}: WithValidation<DeleteVoiceRequirementParams>) =>
  fetcher("/assets/poap/setVoiceRequirement", {
    validation,
    method: "DELETE",
    body,
  })

const useDeleteVoiceRequirement = () => {
  const { mutatePoapEventDetails } = usePoapEventDetails()
  const { mutateVoiceParticipants } = useVoiceParticipants()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<DeleteVoiceRequirementParams, any>(setVoiceRequirement, {
    onError: (error) => showErrorToast(error),
    onSuccess: () => {
      mutateVoiceParticipants([])
      mutatePoapEventDetails()
      toast({
        status: "success",
        title: "Removed voice requirement",
      })
    },
  })
}

export default useDeleteVoiceRequirement
