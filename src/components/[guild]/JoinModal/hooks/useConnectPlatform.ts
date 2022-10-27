import { usePrevious } from "@chakra-ui/react"
import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import useUser from "components/[guild]/hooks/useUser"
import { manageKeyPairAfterUserMerge } from "hooks/useKeyPair"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import { useEffect } from "react"
import { PlatformName } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"
import useDCAuth from "./useDCAuth"
import useGHAuth from "./useGHAuth"
import useGoogleAuth from "./useGoogleAuth"
import useSpotifyAuth from "./useSpotifyAuth"
import useTGAuth from "./useTGAuth"
import useTwitterAuth from "./useTwitterAuth"

const platformAuthHooks: Record<PlatformName, (scope?: string) => any> = {
  DISCORD: useDCAuth,
  GITHUB: useGHAuth,
  TWITTER: useTwitterAuth,
  TELEGRAM: useTGAuth,
  GOOGLE: useGoogleAuth,
  SPOTIFY: useSpotifyAuth,
}

const useConnectPlatform = (
  platform: PlatformName,
  onSuccess?: () => void,
  isReauth?: boolean // Temporary, once /connect works without it, we can remove this
) => {
  const user = useUser()
  const { mutate: mutateUser, platformUsers } = useUser()
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()
  const { onOpen, authData, isAuthenticating, ...rest } =
    platformAuthHooks[platform]()
  const prevAuthData = usePrevious(authData)
  const { account } = useWeb3React()
  const fetcherWithSign = useFetcherWithSign()

  const submit = ({ data, validation }: WithValidation<unknown>) =>
    fetcher("/user/connect", {
      body: data,
      validation,
    }).then((body) => {
      if (body === "rejected") {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw "Something went wrong, connect request rejected."
      }

      if (typeof body === "string") {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw body
      }

      return manageKeyPairAfterUserMerge(fetcherWithSign, user, account).then(
        () => body
      )
    })

  const { onSubmit, isLoading, response } = useSubmitWithSign<
    { platformName: PlatformName; authData: any; reauth?: boolean },
    any
  >(submit, {
    onSuccess: () => {
      addDatadogAction("Successfully connected 3rd party account")
      mutateUser()
      onSuccess?.()
    },
    onError: (err) => {
      addDatadogError("3rd party account connection error", { error: err }, "custom")
    },
  })

  useEffect(() => {
    // couldn't prevent spamming requests without all these three conditions
    if (!platformUsers || !authData || prevAuthData) return
    // const alreadyConnected = platformUsers.some(
    //   (platformAccount) => platformAccount.platformName === platform
    // )
    // if (alreadyConnected) return

    onSubmit({ platformName: platform, authData, reauth: isReauth || undefined })
  }, [authData, platformUsers])

  return {
    onConnect: onOpen,
    isLoading: isAuthenticating || isLoading,
    loadingText: isAuthenticating && "Confirm in the pop-up",
    response,
    authData,
    ...rest,
  }
}

export default useConnectPlatform
export { platformAuthHooks }
