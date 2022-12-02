import useDatadog from "components/_app/Datadog/useDatadog"
import { randomBytes } from "crypto"
import usePopupWindow from "hooks/usePopupWindow"
import useToast from "hooks/useToast"
import { useEffect, useState } from "react"
import useSWRImmutable from "swr/immutable"

type OAuthData<Data> = {
  redirect_url: string
  scope?: string
} & Data

const fallbackData = {
  [process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID]: randomBytes(16).toString("hex"),
  [process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID]: randomBytes(16).toString("hex"),
  [process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID]: randomBytes(16).toString("hex"),
  [process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID]: randomBytes(16).toString("hex"),
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

type OAuthOptions = {
  client_id: string
  scope: string
  response_type?: "code" | "token"
  code_challenge?: "challenge"
  code_challenge_method?: "plain"
}

const useOauthPopupWindow = <OAuthResponse = { code: string }>(
  url: string,
  oauthOptions: OAuthOptions
) => {
  const { addDatadogError, addDatadogAction } = useDatadog()
  const toast = useToast()

  const { data: csrfToken, mutate: mutateCSRFToken } = useSWRImmutable(
    ["CSRFToken", oauthOptions.client_id],
    () => randomBytes(16).toString("hex"),
    { revalidateOnMount: false, fallbackData: fallbackData[oauthOptions.client_id] }
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
  const [authData, setAuthData] = useState<OAuthData<OAuthResponse>>(null)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)

  const dataKey = `oauth_popup_data_${oauthOptions.client_id}`
  const shouldCloseKey = `oauth_window_should_close_${oauthOptions.client_id}`

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
            csrfToken: recievedCsrfToken,
          } = JSON.parse(window.localStorage.getItem(dataKey))

          addDatadogAction(
            `CSRF - Main window recieved CSRF token: ${recievedCsrfToken}. Should equal: ${csrfToken}`
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

            if (recievedCsrfToken !== csrfToken) {
              const title = "Error"
              const errorDescription =
                "Authentication attempt can't be validated. Refresh and try connecting again"

              addDatadogError(`OAuth error - ${title}`, {
                error: errorDescription,
                recievedCsrfToken,
                csrfToken,
              })
              reject({ error: title, errorDescription })
              toast({ status: "error", title, description: errorDescription })
            } else {
              resolve({
                redirect_url: redirectUri,
                scope: oauthOptions.scope,
                ...(data as OAuthResponse),
              })
            }
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
        mutateCSRFToken(randomBytes(16).toString("hex"))
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
        mutateCSRFToken()
      }
    },
    isAuthenticating,
  }
}

export { fetcherWithAuthorization }
export default useOauthPopupWindow
