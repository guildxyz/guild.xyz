import { usePrevious } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useUser from "components/[guild]/hooks/useUser"
import useDatadog from "components/_app/Datadog/useDatadog"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { useEffect } from "react"
import { PlatformName } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"
import useDCAuth from "./useDCAuth"
import useGHAuth from "./useGHAuth"
import useGoogleAuth from "./useGoogleAuth"
import useTGAuth from "./useTGAuth"
import useTwitterAuth from "./useTwitterAuth"

const platformAuthHooks: Record<PlatformName, (scope?: string) => any> = {
  DISCORD: useDCAuth,
  GITHUB: useGHAuth,
  TWITTER: useTwitterAuth,
  TELEGRAM: useTGAuth,
  GOOGLE: useGoogleAuth,
}

const useConnectPlatform = (
  platform: PlatformName,
  onSuccess?: () => void,
  isReauth?: boolean // Temporary, once /connect works without it, we can remove this
) => {
  const { addDatadogAction, addDatadogError } = useDatadog()
  const showErrorToast = useShowErrorToast()

  const user = useUser()
  const { mutate: mutateUser, platformUsers } = useUser()
  const { onOpen, authData, isAuthenticating, ...rest } =
    platformAuthHooks[platform]()
  const prevAuthData = usePrevious(authData)
  const { account } = useWeb3React()
  const fetcherWithSign = useFetcherWithSign()

  const submit = (signedValidation: SignedValdation) =>
    fetcher("/user/connect", signedValidation).then((body) => {
      if (body === "rejected") {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw "Something went wrong, connect request rejected."
      }

      if (typeof body === "string") {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw body
      }

      return body
    })

  const { onSubmit, isLoading, response } = useSubmitWithSign<{
    platformName: PlatformName
    authData: any
    reauth?: boolean
  }>(submit, {
    onSuccess: () => {
      addDatadogAction("Successfully connected 3rd party account")
      mutateUser()
      onSuccess?.()
    },
    onError: (err) => {
      showErrorToast(err)
      addDatadogError("3rd party account connection error", { error: err })
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
