import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import usePersonalSign from "hooks/usePersonalSign"
import useSubmit from "hooks/useSubmit"
import { mutate } from "swr"
import { PlatformName } from "types"
import fetcher from "utils/fetcher"

type Response = {
  inviteLink: string
  alreadyJoined?: boolean
}

const useJoinPlatform = (
  platform: PlatformName,
  platformUserId: string,
  roleId: number
) => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()
  const { addressSignedMessage } = usePersonalSign()

  const submit = (): Promise<Response> =>
    fetcher(`/user/joinPlatform`, {
      body: {
        platform,
        roleId,
        addressSignedMessage,
        platformUserId,
      },
    })

  return useSubmit<any, Response>(submit, {
    // Revalidating the address list in the AccountModal component
    onSuccess: () => {
      addDatadogAction(`Successfully joined a guild`)
      addDatadogAction(`Successfully joined a guild [${platform}]`)
      mutate(`/user/${addressSignedMessage}`)
    },
    onError: (err) => {
      addDatadogError(`Guild join error`, { error: err }, "custom")
      addDatadogError(`Guild join error [${platform}]`, { error: err }, "custom")
    },
  })
}

export default useJoinPlatform
