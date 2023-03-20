import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import useVoiceParticipants from "../components/ManageEvent/components/EligibleMembers/hooks/useVoiceParticipants"
import usePoapEventDetails from "./usePoapEventDetails"

type DeleteVoiceRequirementParams = {
  poapId: number
}

const setVoiceRequirement = (signedValdation: SignedValdation) =>
  fetcher("/assets/poap/setVoiceRequirement", {
    method: "DELETE",
    ...signedValdation,
  })

const useDeleteVoiceRequirement = (poapId, { onSuccess }: UseSubmitOptions) => {
  const { mutatePoapEventDetails } = usePoapEventDetails(poapId)
  const { mutateVoiceParticipants } = useVoiceParticipants(poapId)

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<DeleteVoiceRequirementParams>(setVoiceRequirement, {
    onError: (error) => showErrorToast(error),
    onSuccess: () => {
      mutateVoiceParticipants([])
      mutatePoapEventDetails()
      toast({
        status: "success",
        title: "Successfully removed voice requirement",
      })
      onSuccess?.()
    },
  })
}

export default useDeleteVoiceRequirement
