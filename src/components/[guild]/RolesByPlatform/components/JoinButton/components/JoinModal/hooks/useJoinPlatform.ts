import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidationData } from "hooks/useSubmit/useSubmit"
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
  const { account, library } = useWeb3React()
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const submit = ({
    validationData,
  }: WithValidationData<unknown>): Promise<Response> =>
    fetcher(`/user/joinPlatform`, {
      body: {
        platform,
        roleId,
        platformUserId,
      },
      validationData,
    })

  return useSubmitWithSign<any, Response>(submit, {
    // Revalidating the address list in the AccountModal component
    onSuccess: () => {
      addDatadogAction(`Successfully joined a guild`)
      addDatadogAction(`Successfully joined a guild [${platform}]`)
      mutate(`/user/${account}`)
    },
    onError: (err) => {
      addDatadogError(`Guild join error`, { error: err }, "custom")
      addDatadogError(`Guild join error [${platform}]`, { error: err }, "custom")
    },
  })
}

export default useJoinPlatform
