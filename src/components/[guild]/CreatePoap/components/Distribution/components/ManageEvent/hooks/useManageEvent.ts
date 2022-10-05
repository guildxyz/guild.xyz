import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import fetcher from "utils/fetcher"

type HandleVoiceEventParams = {
  guildId: number
  poapId: number
  action: "START" | "STOP"
}

const handleVoiceEvent = ({
  validation,
  data: body,
}: WithValidation<HandleVoiceEventParams>) =>
  fetcher("/discord/handleVoiceEvent", {
    validation,
    body,
  })

const useManageEvent = () => {
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<HandleVoiceEventParams, any>(handleVoiceEvent, {
    onError: (error) => showErrorToast(error),
  })
}

export default useManageEvent
