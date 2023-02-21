import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import usePoapEventDetails from "./usePoapEventDetails"

const setVoiceRequirement = (signedValidation: SignedValdation) =>
  fetcher("/assets/poap/setVoiceRequirement", signedValidation)

const useSetVoiceRequirement = ({ onSuccess }: UseSubmitOptions = {}) => {
  const { mutatePoapEventDetails } = usePoapEventDetails()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<any>(setVoiceRequirement, {
    onError: (error) => showErrorToast(error),
    onSuccess: () => {
      mutatePoapEventDetails()
      toast({
        status: "success",
        title: "Successful event setup!",
      })
      onSuccess?.()
    },
  })
}

export default useSetVoiceRequirement
