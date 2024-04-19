import usePopupWindow from "hooks/usePopupWindow"
import useToast from "hooks/useToast"
import randomBytes from "randombytes"
import { useEffect, useState } from "react"
import { OneOf, PlatformName } from "types"

type OAuthData<Data> = {
  redirect_url: string
  scope?: string
} & Data

type OAuthError = { error: string; errorDescription: string }

export type Message = OneOf<
  { type: "OAUTH_ERROR"; data: OAuthError },
  { type: "OAUTH_SUCCESS"; data: any }
>

type OAuthState<OAuthResponse> = {
  error: OAuthError
  authData: OAuthData<OAuthResponse>
  isAuthenticating: boolean
}

const useOauthPopupWindow = <OAuthResponse = { code: string }>(
  platformName: PlatformName,
  url: string,
  params: Record<string, any>
): OAuthState<OAuthResponse> & {
  onOpen: () => Promise<OAuthState<OAuthResponse>>
} => {
  const toast = useToast()

  const redirectUri =
    typeof window !== "undefined" &&
    `${window.location.href.split("/").slice(0, 3).join("/")}/oauth`

  params.response_type = params.response_type ?? "code"

  const { onOpen } = usePopupWindow()

  const [oauthState, setOauthState] = useState<OAuthState<OAuthResponse>>({
    error: null,
    authData: null,
    isAuthenticating: false,
  })

  const oauthPopupHandler = async () => {
    let result: OAuthState<OAuthResponse> = {
      isAuthenticating: true,
      authData: null,
      error: null,
    }
    setOauthState(result)

    const csrfToken = randomBytes(32).toString("hex")
    const localStorageKey = `${platformName}_oauthinfo`

    const infoToPassInLocalStorage = {
      csrfToken,
      from: window.location.toString(),
      platformName,
      redirect_url: redirectUri,
      scope: params.scope ?? "",
    }

    window.localStorage.setItem(
      localStorageKey,
      JSON.stringify(infoToPassInLocalStorage)
    )

    const channel = new BroadcastChannel(
      platformName === "TWITTER_V1" ? "TWITTER_V1" : csrfToken
    )

    const hasReceivedResponse = new Promise<void>((resolve) => {
      channel.onmessage = (event: MessageEvent<Message>) => {
        const { type, data } = event.data

        if (type === "OAUTH_ERROR") {
          result = {
            isAuthenticating: false,
            error: data,
            authData: null,
          }
          setOauthState(result)
        } else {
          result = {
            isAuthenticating: false,
            error: null,
            authData: data,
          }
          setOauthState(result)
        }

        resolve()
      }
    })

    const searchParams = new URLSearchParams({
      ...params,
      redirect_uri: redirectUri,
      state: `${platformName}-${csrfToken}`,
    }).toString()

    onOpen(`${url}?${searchParams}`)

    await hasReceivedResponse.finally(() => {
      channel.postMessage({ type: "OAUTH_CONFIRMATION" })
      window.localStorage.removeItem(localStorageKey)
      // Close Broadcast Channel
      channel.close()
    })

    return result
  }

  useEffect(() => {
    if (!oauthState.error) return

    const title = oauthState.error.error ?? "Unknown error"
    const errorDescription = oauthState.error.errorDescription ?? ""

    toast({ status: "error", title, description: errorDescription })

    // toast is left out on purpose, it causes the toast to be shown twice
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oauthState.error])

  return {
    ...oauthState,
    onOpen: oauthPopupHandler,
  }
}

export default useOauthPopupWindow
