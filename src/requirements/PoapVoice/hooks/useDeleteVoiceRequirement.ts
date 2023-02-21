import useVoiceParticipants from "components/[guild]/CreatePoap/components/Distribution/components/ManageEvent/components/EligibleMembers/hooks/useVoiceParticipants"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import usePoapEventDetails from "./usePoapEventDetails"

type DeleteVoiceRequirementParams = {
  poapId: number
}

const setVoiceRequirement = (signedValdation: SignedValdation) =>
  fetcher("/assets/poap/setVoiceRequirement", {
    method: "DELETE",
    ...signedValdation,
  })

const useDeleteVoiceRequirement = () => {
  const { mutatePoapEventDetails } = usePoapEventDetails()
  const { mutateVoiceParticipants } = useVoiceParticipants()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<DeleteVoiceRequirementParams>(setVoiceRequirement, {
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
