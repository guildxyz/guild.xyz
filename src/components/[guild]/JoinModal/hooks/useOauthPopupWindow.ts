import useDatadog from "components/_app/Datadog/useDatadog"
import { randomBytes } from "crypto"
import usePopupWindow from "hooks/usePopupWindow"
import useToast from "hooks/useToast"
import platforms from "platforms"
import { useEffect, useRef, useState } from "react"
import { PlatformName } from "types"

type OAuthData<Data> = {
  redirect_url: string
  scope?: string
} & Data

const useOauthPopupWindow = <OAuthResponse = { code: string }>(
  platform: PlatformName,
  scopeType: "membership" | "creation"
) => {
  const { addDatadogAction } = useDatadog()
  const toast = useToast()

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { baseUrl, scope, client_id, ...otherOAuthParams } =
    platforms?.[platform]?.oauthParams ?? {}

  const redirectUri =
    typeof window !== "undefined" &&
    `${window.location.href.split("/").slice(0, 3).join("/")}/oauth`

  const csrfToken = useRef(randomBytes(16).toString("hex"))

  // prettier-ignore
  const { onOpen, windowInstance } = usePopupWindow(
    `${baseUrl}?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scope[scopeType] ?? scope.membership)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(JSON.stringify([client_id, csrfToken.current]))}&${Object.entries(otherOAuthParams).map(([key, value]) => `${key}=${value}`).join("&")}`
  )

  const [error, setError] = useState(null)
  const [authData, setAuthData] = useState<OAuthData<OAuthResponse>>(null)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)

  const dataKey = `oauth_popup_data_${client_id}`
  const shouldCloseKey = `oauth_window_should_close_${client_id}`

  /** On a window creation, we set a new listener */
  useEffect(() => {
    if (!windowInstance) return

    const windowInstanceOpenInitially = !windowInstance.closed

    setIsAuthenticating(true)

    new Promise<OAuthData<OAuthResponse>>((resolve, reject) => {
      const interval = setInterval(() => {
        try {
          const {
            data,
            type,
            csrfToken: receivedCsrfToken,
          } = JSON.parse(window.localStorage.getItem(dataKey))

          addDatadogAction(
            `CSRF - Main window received CSRF token: ${receivedCsrfToken}. Should equal: ${csrfToken}`
          )

          if (type === "OAUTH_ERROR") {
            clearInterval(interval)
            const title = data?.error ?? "Unknown error"
            const errorDescription = data?.errorDescription ?? ""
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

        window.localStorage.removeItem(dataKey)
        setIsAuthenticating(false)
        window.localStorage.setItem(shouldCloseKey, "true")
      })
  }, [windowInstance])

  return {
    authData,
    error,
    onOpen: () => {
      setError(null)
      if (typeof csrfToken.current === "string" && csrfToken.current.length > 0) {
        onOpen()
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
