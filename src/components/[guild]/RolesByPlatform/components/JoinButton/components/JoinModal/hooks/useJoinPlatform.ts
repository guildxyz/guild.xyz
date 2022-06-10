import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import { mutate } from "swr"
import { PlatformName } from "types"
import fetcher from "utils/fetcher"

type Response = {
  inviteLink: string
  alreadyJoined?: boolean
}

const useJoinPlatform = (platform: PlatformName, platformUserId: string) => {
  const { account } = useWeb3React()
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const guild = useGuild()

  const submit = ({
    data,
    validation,
  }: WithValidation<unknown>): Promise<Response> =>
    fetcher(`/user/join`, {
      body: data,
      validation,
    }).then((body) => {
      if (body === "rejected") {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw "Something went wrong, join request rejected."
      }
      return body
    })

  const useSubmitResponse = useSubmitWithSign<any, Response>(submit, {
    // Revalidating the address list in the AccountModal component
    onSuccess: () => {
      addDatadogAction(`Successfully joined a guild`)
      if (platform?.length > 0)
        addDatadogAction(`Successfully joined a guild [${platform}]`)
      mutate(`/user/${account}`)
    },
    onError: (err) => {
      addDatadogError(`Guild join error`, { error: err }, "custom")
      if (platform?.length > 0)
        addDatadogError(`Guild join error [${platform}]`, { error: err }, "custom")
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: () =>
      useSubmitResponse.onSubmit({
        guildId: guild?.id,
        ...(platform?.length > 0
          ? {
              platformUserId,
              platform,
            }
          : {}),
      }),
  }
}

export default useJoinPlatform
