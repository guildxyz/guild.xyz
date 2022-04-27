import { randomBytes } from "crypto"
import useLocalStorage from "hooks/useLocalStorage"
import usePopupWindow from "hooks/usePopupWindow"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

type Auth = {
  accessToken: string
  tokenType: string
  expires: number
  authorization: string
}

const fetcherWithDCAuth = async (authorization: string, endpoint: string) => {
  const response = await fetch(endpoint, {
    headers: {
      authorization,
    },
  }).catch(() => {
    Promise.reject({
      error: "Network error",
      errorDescription:
        "Unable to connect to Discord server. If you're using some tracking blocker extension, please try turning that off",
    })
    return undefined
  })

  if (!response?.ok) {
    Promise.reject({
      error: "Discord error",
      errorDescription: "There was an error, while fetching the user data",
    })
  }

  return response.json()
}

const useDCAuth = (scope: string) => {
  const router = useRouter()
  const [csrfToken] = useLocalStorage(
    "dc_auth_csrf_token",
    randomBytes(16).toString("base64"),
    true
  )
  const state = JSON.stringify({ csrfToken, url: router.asPath })

  const redirectUri =
    typeof window !== "undefined" &&
    `${window.location.href.split("/").slice(0, 3).join("/")}/dcauth`

  // prettier-ignore
  const { onOpen, windowInstance } = usePopupWindow(
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`
  )
  const [error, setError] = useState(null)
  const [auth, setAuth] = useLocalStorage<Partial<Auth>>(`dc_auth_${scope}`, {})

  useEffect(() => {
    if (!auth.expires) return
    if (Date.now() > auth.expires) {
      setAuth({})
    } else {
      const timeout = setTimeout(() => {
        setAuth({})
        // Extra 60_000 is just for safety, since timeout is known to be somewhat unreliable
      }, auth.expires - Date.now() - 60_000)

      return () => clearTimeout(timeout)
    }
  }, [auth])

  /** On a window creation, we set a new listener */
  useEffect(() => {
    if (!windowInstance) return

    const popupMessageListener = async (event: MessageEvent) => {
      /**
       * Conditions are for security and to make sure, the expected messages are
       * being handled (extensions are also communicating with message events)
       */
      if (
        event.isTrusted &&
        event.origin === window.location.origin &&
        typeof event.data === "object" &&
        "type" in event.data &&
        "data" in event.data
      ) {
        const { data, type } = event.data

        switch (type) {
          case "DC_AUTH_SUCCESS":
            setAuth({
              ...data,
              authorization: `${data?.tokenType} ${data?.accessToken}`,
            })
            break
          case "DC_AUTH_ERROR":
            setError(data)
            break
          default:
            // Should never happen, since we are only processing events that are originating from us
            setError({
              error: "Invalid message",
              errorDescription:
                "Recieved invalid message from authentication window",
            })
        }

        windowInstance?.close()
      }
    }

    window.addEventListener("message", popupMessageListener)
    return () => window.removeEventListener("message", popupMessageListener)
  }, [windowInstance])

  return {
    authorization: auth?.authorization,
    error,
    onOpen: () => {
      setError(null)
      onOpen()
    },
    isAuthenticating: !!windowInstance && !windowInstance.closed,
  }
}

export { fetcherWithDCAuth }
export default useDCAuth
