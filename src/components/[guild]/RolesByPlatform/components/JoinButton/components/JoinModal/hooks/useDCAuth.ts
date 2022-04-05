import { usePrevious } from "@chakra-ui/react"
import { randomBytes } from "crypto"
import useLocalStorage from "hooks/useLocalStorage"
import usePopupWindow from "hooks/usePopupWindow"
import { useEffect, useState } from "react"
import { DiscordServerData } from "types"

const getPopupMessageListener =
  (onSuccess: (value?: any) => void, onError: (value: any) => void) =>
  (event: MessageEvent) => {
    // Conditions are for security and to make sure, the expected messages are being handled
    // (extensions are also communicating with message events)
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
          onSuccess(data)
          break
        case "DC_AUTH_ERROR":
          onError(data)
          break
        default:
          // Should never happen, since we are only processing events that are originating from us
          onError({
            error: "Invalid message",
            errorDescription: "Recieved invalid message from authentication window",
          })
      }
    }
  }

type SupportedScope = "identify" | "guilds"

export type OAuthParams = {
  scope: SupportedScope[]
  state: Record<string, any>
}

const useDCAuth = () => {
  const { onOpen, windowInstance } = usePopupWindow()
  const prevWindowInstance = usePrevious(windowInstance)
  const [error, setError] = useState(null)
  const [data, setData] = useState<{ id: string; servers?: DiscordServerData[] }>({
    id: null,
  })

  const [, setCsrfToken] = useLocalStorage("dc_auth_csrf_token", "")

  // This way we can detect and handle MetaMask's built-in browser
  const isAndroidBrowser = /android sdk/i.test(window?.navigator?.userAgent ?? "")

  /** On a window creation, we set a new listener */
  useEffect(() => {
    if (!windowInstance) return
    const popupMessageListener = getPopupMessageListener(
      (dataFromMessage) => {
        windowInstance?.close()
        setData(dataFromMessage)
      },
      (errorFromMessage) => {
        windowInstance?.close()
        setError(errorFromMessage)
      }
    )
    window.addEventListener("message", popupMessageListener)

    return () => window.removeEventListener("message", popupMessageListener)
  }, [windowInstance])

  /**
   * If the window has been closed, and we don't have id, nor error, we set an error
   * explaining that the window has been manually closed
   */
  useEffect(() => {
    if (
      !isAndroidBrowser &&
      !!prevWindowInstance &&
      !windowInstance &&
      !error &&
      !data?.id
    ) {
      setError({
        error: "Authorization rejected",
        errorDescription:
          "Please try again and authenticate your Discord account in the popup window",
      })
    }
  }, [error, data, prevWindowInstance, windowInstance, isAndroidBrowser])

  return {
    data,
    error,
    onOpen: (params: OAuthParams) => {
      setError(null)
      const newCsrfToken = randomBytes(16).toString("base64")
      setCsrfToken(newCsrfToken)
      const state = encodeURIComponent(
        JSON.stringify({
          ...(params?.state ?? {}),
          csrfToken: newCsrfToken,
        })
      )
      onOpen(
        `https://discord.com/api/oauth2/authorize?client_id=${
          process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
        }&response_type=token&scope=${params.scope.join("%20")}&redirect_uri=${
          process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI
        }&state=${state}`
      )
    },
    isAuthenticating: !!windowInstance && !windowInstance.closed,
  }
}

export default useDCAuth
