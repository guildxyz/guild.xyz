import useDatadog from "components/_app/Datadog/useDatadog"
import { randomBytes } from "crypto"
import useLocalStorage from "hooks/useLocalStorage"
import usePopupWindow from "hooks/usePopupWindow"
import useToast from "hooks/useToast"
import platforms from "platforms"
import { useEffect, useState } from "react"
import { PlatformName } from "types"

type OAuthData<Data> = {
  redirect_url: string
  scope?: string
} & Data

const useOauthPopupWindow = <OAuthResponse = { code: string }>(
  platform: PlatformName,
  scopeType: "membership" | "creation"
) => {
  const { addDatadogError } = useDatadog()
  const toast = useToast()

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { baseUrl, scope, client_id, ...otherOAuthParams } =
    platforms?.[platform]?.oauthParams ?? {}

  const [hasClickedOpen, setHasClickedOpen] = useState<boolean>(false)
  const [csrfToken, setCsrfToken] = useLocalStorage(
    `oauth_csrf_token_${client_id}`,
    null
  )

  const redirectUri =
    typeof window !== "undefined" &&
    `${window.location.href.split("/").slice(0, 3).join("/")}/oauth`

  const state = `${client_id};${csrfToken}`

  // prettier-ignore
  const { onOpen, windowInstance } = usePopupWindow(
    `${baseUrl}?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scope[scopeType])}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&${Object.entries(otherOAuthParams).map(([key, value]) => `${key}=${value}`).join("&")}`
  )

  useEffect(() => {
    if (csrfToken && hasClickedOpen) {
      onOpen()
    }
  }, [csrfToken, hasClickedOpen])

  const [error, setError] = useState(null)
  const [authData, setAuthData] = useState<OAuthData<OAuthResponse>>(null)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)

  /** On a window creation, we set a new listener */
  useEffect(() => {
    if (!windowInstance) return

    const windowInstanceOpenInitially = !windowInstance.closed

    window.localStorage.removeItem("oauth_popup_data")
    setIsAuthenticating(true)

    new Promise<OAuthData<OAuthResponse>>((resolve, reject) => {
      const interval = setInterval(() => {
        try {
          const { data, type } = JSON.parse(
            window.localStorage.getItem("oauth_popup_data")
          )
          if (type === "OAUTH_ERROR") {
            clearInterval(interval)
            const title = data?.error ?? "Unknown error"
            const errorDescription = data?.errorDescription ?? ""
            addDatadogError(`OAuth error - ${title}`, { error: errorDescription })
            reject({ error: title, errorDescription })
            toast({ status: "error", title, description: errorDescription })
          }
          if (type === "OAUTH_SUCCESS") {
            clearInterval(interval)
            resolve({
              redirect_url: redirectUri,
              scope: scope[scopeType],
              ...(data as OAuthResponse),
            })
          }
        } catch {}
      }, 500)
    })
      .then(setAuthData)
      .catch(setError)
      .finally(() => {
        if (windowInstanceOpenInitially) {
          const closeInterval = setInterval(() => {
            if (windowInstance.closed) {
              setIsAuthenticating(false)
              clearInterval(closeInterval)
            }
          }, 500)
        }

        window.localStorage.removeItem("oauth_popup_data")
        setIsAuthenticating(false)
        window.localStorage.setItem("oauth_window_should_close", "true")
      })
  }, [windowInstance])

  return {
    authData,
    error,
    onOpen: () => {
      setError(null)
      if (typeof csrfToken === "string" && csrfToken.length > 0) {
        onOpen()
      } else {
        setHasClickedOpen(true)
        setCsrfToken(randomBytes(16).toString("hex"))
      }
    },
    isAuthenticating,
  }
}

const useOauthPopupWindowWrapper = (
  platform: PlatformName,
  scopeType: "membership" | "creation"
) => (platforms[platform].authHook ?? useOauthPopupWindow)(platform, scopeType)

export default useOauthPopupWindowWrapper
