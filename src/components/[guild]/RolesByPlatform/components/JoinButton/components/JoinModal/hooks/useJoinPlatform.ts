import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidation } from "hooks/useSubmit/useSubmit"
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
    data,
    validation,
  }: WithValidation<unknown>): Promise<Response> =>
    fetcher(`/user/joinPlatform`, {
      body: data,
      validation,
    })

  const useSubmitResponse = useSubmitWithSign<any, Response>(submit, {
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

  return {
    ...useSubmitResponse,
    onSubmit: () =>
      useSubmitResponse.onSubmit({
        platform,
        roleId,
        platformUserId,
      }),
  }
}

export default useJoinPlatform
