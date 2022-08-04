import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { manageKeyPairAfterUserMerge } from "hooks/useKeyPair"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import { PlatformName, PlatformType } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"

type PlatformResult = {
  platformId: number
  platformName: PlatformName
} & (
  | { success: true }
  | {
      success: false
      errorMsg: "Unknown Member"
      invite: string
    }
)

type Response = {
  success: boolean
  platformResults: PlatformResult[]
}

export type JoinData =
  | {
      oauthData: any
    }
  | {
      hash: string
    }

const useJoin = (onSuccess?: () => void) => {
  const { account } = useWeb3React()
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const guild = useGuild()
  const user = useUser()
  const fetcherWithSign = useFetcherWithSign()

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

      if (typeof body === "string") {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw body
      }

      return manageKeyPairAfterUserMerge(fetcherWithSign, user, account).then(
        () => body
      )
    })

  const useSubmitResponse = useSubmitWithSign<any, Response>(submit, {
    // Revalidating the address list in the AccountModal component
    onSuccess: () => {
      addDatadogAction(`Successfully joined a guild`)
      onSuccess?.()
    },
    onError: (err) => {
      addDatadogError(`Guild join error`, { error: err }, "custom")
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) =>
      useSubmitResponse.onSubmit({
        guildId: guild?.id,
        platforms: Object.keys(data.platforms)?.some(
          (p: any) => p === PlatformType.GOOGLE
        )
          ? undefined
          : Object.entries(data.platforms).map(([key, value]: any) => ({
              name: key,
              ...value,
            })),
      }),
  }
}

export default useJoin
