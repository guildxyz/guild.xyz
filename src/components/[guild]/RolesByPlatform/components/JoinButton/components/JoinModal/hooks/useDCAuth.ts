import { usePrevious } from "@chakra-ui/react"
import usePopupWindow from "hooks/usePopupWindow"
import { useEffect, useState } from "react"
import useSWR from "swr"

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

const useDCAuth = <OAuthCallResult>(
  onSuccess: (authorization: string) => Promise<OAuthCallResult>
) => {
  const { onOpen, windowInstance } = usePopupWindow()
  const prevWindowInstance = usePrevious(windowInstance)
  const [discordError, setDiscordError] = useState(null)
  const [authorization, setAuthorization] = useState(null)

  const shouldFetch = !!onSuccess && !!authorization
  const { data, isValidating, error } = useSWR(
    shouldFetch ? ["oauthFetcher", authorization, onSuccess] : null,
    (_, auth) => onSuccess(auth),
    { onSuccess: () => setDiscordError(null), onError: setDiscordError }
  )

  /** On a window creation, we set a new listener */
  useEffect(() => {
    if (!windowInstance) return
    const popupMessageListener = getPopupMessageListener(
      (auth) => {
        windowInstance?.close()
        setAuthorization(auth)
      },
      (err) => {
        windowInstance?.close()
        setDiscordError(err)
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
    if (!!prevWindowInstance && !windowInstance && !error && !data) {
      setDiscordError({
        error: "Authorization rejected",
        errorDescription:
          "Please try again and authenticate your Discord account in the popup window",
      })
    }
  }, [error, data, prevWindowInstance, windowInstance])

  return {
    data,
    error: discordError,
    onOpen: (url: string) => {
      setDiscordError(null)
      onOpen(url)
    },
    isAuthenticating: (!!windowInstance && !windowInstance.closed) || isValidating,
  }
}

export default useDCAuth
