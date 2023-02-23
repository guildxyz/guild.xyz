import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import fetcher from "utils/fetcher"

type HandleVoiceEventParams = {
  guildId: number
  poapId: number
  action: "START" | "STOP"
}

const handleVoiceEvent = (signedValidation: SignedValdation) =>
  fetcher("/discord/handleVoiceEvent", signedValidation)

const useManageEvent = ({ onSuccess }: UseSubmitOptions = {}) => {
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<any>(handleVoiceEvent, {
    onError: (error) => showErrorToast(error),
    onSuccess,
  })
}

export default useManageEvent
