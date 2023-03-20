import useDatadog from "components/_app/Datadog/useDatadog"
import { randomBytes } from "crypto"
import usePopupWindow from "hooks/usePopupWindow"
import useToast from "hooks/useToast"
import { useEffect, useState } from "react"
import { OneOf, PlatformName } from "types"

type OAuthData<Data> = {
  redirect_url: string
  scope?: string
} & Data

type OAuthOptions = {
  client_id: string
  scope: string
  response_type?: "code" | "token"
  code_challenge?: "challenge"
  code_challenge_method?: "plain"
}

type OAuthError = { error: string; errorDescription: string }

export type Message = OneOf<
  { type: "OAUTH_ERROR"; data: OAuthError },
  { type: "OAUTH_SUCCESS"; data: any }
>

const useOauthPopupWindow = <OAuthResponse = { code: string }>(
  platformName: PlatformName,
  url: string,
  oauthOptions: OAuthOptions
) => {
  const { addDatadogError } = useDatadog()
  const toast = useToast()

  const redirectUri =
    typeof window !== "undefined" &&
    `${window.location.href.split("/").slice(0, 3).join("/")}/oauth`

  oauthOptions.response_type = oauthOptions.response_type ?? "code"

  const { onOpen } = usePopupWindow()

  const [oauthState, setOauthState] = useState<{
    error: OAuthError
    authData: OAuthData<OAuthResponse>
    isAuthenticating: boolean
  }>({
    error: null,
    authData: null,
    isAuthenticating: false,
  })

  const oauthPopupHandler = async () => {
    // Reset state variables
    setOauthState({
      isAuthenticating: true,
      authData: null,
      error: null,
    })

    // Generate csrf token
    const csrfToken = randomBytes(32).toString("base64")
    const localStorageKey = `oauth_${csrfToken}`

    const infoToPassInLocalStorage = {
      csrfToken,
      from: window.location.toString(),
      platformName,
      redirect_url: redirectUri,
      scope: oauthOptions.scope,
    }

    window.localStorage.setItem(
      localStorageKey,
      JSON.stringify(infoToPassInLocalStorage)
    )

    // Create Broadcast Channel
    const channel = new BroadcastChannel(csrfToken)

    // Create promise, which resolves when the result is catched
    const hasReceivedResponse = new Promise<void>((resolve) => {
      channel.onmessage = (event: MessageEvent<Message>) => {
        const { type, data } = event.data

        if (type === "OAUTH_ERROR") {
          setOauthState({
            isAuthenticating: false,
            error: data,
            authData: null,
          })
        } else {
          setOauthState({
            isAuthenticating: false,
            error: null,
            authData: data,
          })
        }

        resolve()
      }
    })

    // Open Popup window
    onOpen(
      `${url}?${Object.entries(oauthOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&state=${encodeURIComponent(csrfToken)}`
    )

    // Wait for an OAuth response
    await hasReceivedResponse.finally(() => {
      channel.postMessage({ type: "OAUTH_CONFIRMATION" })
      window.localStorage.removeItem(localStorageKey)
      // Close Broadcast Channel
      channel.close()
    })
  }

  useEffect(() => {
    if (!oauthState.error) return

    const title = oauthState.error.error ?? "Unknown error"
    const errorDescription = oauthState.error.errorDescription ?? ""

    toast({ status: "error", title, description: errorDescription })
    addDatadogError(`OAuth error - ${title}`, { error: errorDescription })
  }, [oauthState.error])

  return {
    ...oauthState,
    onOpen: oauthPopupHandler,
  }
}

export default useOauthPopupWindow
