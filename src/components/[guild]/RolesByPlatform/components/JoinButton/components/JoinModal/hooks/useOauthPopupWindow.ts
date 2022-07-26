import { randomBytes } from "crypto"
import useLocalStorage from "hooks/useLocalStorage"
import usePopupWindow from "hooks/usePopupWindow"
import useToast from "hooks/useToast"
import { useEffect, useState } from "react"

type OAuthResponse = {
  accessToken: string
  tokenType: string
  expires: number
  authorization: string
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
    "oauth_csrf_token",
    randomBytes(16).toString("hex"),
    true
  )

  const redirectUri =
    typeof window !== "undefined" &&
    `${window.location.href.split("/").slice(0, 3).join("/")}/oauth`

  oauthOptions.response_type = oauthOptions.response_type ?? "code"

  // prettier-ignore
  const { onOpen, windowInstance } = usePopupWindow(
    `${url}?${Object.entries(oauthOptions).map(([key, value]) => `${key}=${value}`).join("&")}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${csrfToken}`
  )
  const [error, setError] = useState(null)
  const [code, setCode] = useState<Partial<OAuthResponse>>(null)

  /** On a window creation, we set a new listener */
  useEffect(() => {
    if (!windowInstance) return

    window.localStorage.setItem("oauth_popup_data", null)

    new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        try {
          const { data, type } = JSON.parse(
            window.localStorage.getItem("oauth_popup_data")
          )
          if (type === "OAUTH_ERROR") {
            clearInterval(interval)
            reject({
              error: data?.error ?? "Unknown error",
              errorDescription: data?.errorDescription ?? "",
            })
          }
          if (type === "OAUTH_SUCCESS") {
            clearInterval(interval)
            resolve(data)
          }
        } catch {}
      }, 500)
    })
      .then(setCode)
      .catch(setError)
      .finally(() => {
        setCsrfToken(randomBytes(16).toString("hex"))
        window.localStorage.setItem("oauth_popup_data", null)

        /**
         * TODO: We can't just close the Twitter popup like this.. Create another
         * localStorage variable "oauth_popup_should_close", and poll it similarly on
         * the popup side, if it's true, it should close itself
         */
        windowInstance.close()
      })
  }, [windowInstance])

  return {
    code,
    error,
    onOpen: () => {
      setError(null)
      onOpen()
    },
    isAuthenticating: !!windowInstance && !windowInstance.closed,
  }
}

export { fetcherWithAuthorization }
export default useOauthPopupWindow
