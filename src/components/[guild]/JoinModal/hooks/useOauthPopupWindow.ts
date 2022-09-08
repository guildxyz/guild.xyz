import { randomBytes } from "crypto"
import useLocalStorage from "hooks/useLocalStorage"
import usePopupWindow from "hooks/usePopupWindow"
import useToast from "hooks/useToast"
import { useEffect, useState } from "react"

type OAuthData = {
  code: string
  redirect_url: string
  scope?: string
}

const fetcherWithAuthorization = async (authorization: string, endpoint: string) => {
  const response = await fetch(endpoint, {
    headers: {
      authorization,
    },
  }).catch(() => {
    Promise.reject({
      error: "Network error",
      errorDescription: `Unable to connect to reach "${endpoint}". If you're using some tracking blocker extension, please try turning that off`,
    })
    return undefined
  })

  if (!response?.ok) {
    Promise.reject({
      error: "Authentication error",
      errorDescription: "There was an error, while fetching the user data",
    })
  }

  return response.json()
}

type OauthOptions = {
  client_id: string
  scope: string
  response_type?: "code" | "token"
  code_challenge?: "challenge"
  code_challenge_method?: "plain"
}

const useOauthPopupWindow = (url: string, oauthOptions: OauthOptions) => {
  const toast = useToast()
  const [csrfToken, setCsrfToken] = useLocalStorage(
    `oauth_csrf_token_${oauthOptions.client_id}`,
    randomBytes(16).toString("hex"),
    true
  )

  const redirectUri =
    typeof window !== "undefined" &&
    `${window.location.href.split("/").slice(0, 3).join("/")}/oauth`

  oauthOptions.response_type = oauthOptions.response_type ?? "code"

  const state = `${oauthOptions.client_id};${csrfToken}`

  // prettier-ignore
  const { onOpen, windowInstance } = usePopupWindow(
    `${url}?${Object.entries(oauthOptions).map(([key, value]) => `${key}=${value}`).join("&")}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`
  )
  const [error, setError] = useState(null)
  const [authData, setAuthData] = useState<OAuthData>(null)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)

  /** On a window creation, we set a new listener */
  useEffect(() => {
    if (!windowInstance) return

    const windowInstanceOpenInitially = !windowInstance.closed

    window.localStorage.removeItem("oauth_popup_data")
    setIsAuthenticating(true)

    new Promise<OAuthData>((resolve, reject) => {
      const interval = setInterval(() => {
        try {
          const { data, type } = JSON.parse(
            window.localStorage.getItem("oauth_popup_data")
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
              code: data,
              redirect_url: redirectUri,
              scope: oauthOptions.scope,
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

        setCsrfToken(randomBytes(16).toString("hex"))
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
      onOpen()
    },
    isAuthenticating,
  }
}

export { fetcherWithAuthorization }
export default useOauthPopupWindow
