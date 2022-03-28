import { usePrevious } from "@chakra-ui/react"
import usePopupWindow from "hooks/usePopupWindow"
import { useEffect, useState } from "react"

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

const useDCAuth = () => {
  const { onOpen, windowInstance } = usePopupWindow()
  const prevWindowInstance = usePrevious(windowInstance)
  const [error, setError] = useState(null)
  const [id, setId] = useState(null)

  // This way we can detect and handle MetaMask's built-in browser
  const isAndroidBrowser = /android sdk/i.test(window?.navigator?.userAgent ?? "")

  /** On a window creation, we set a new listener */
  useEffect(() => {
    if (!windowInstance) return
    const popupMessageListener = getPopupMessageListener(
      ({ id: idFromMessage }) => {
        windowInstance?.close()
        setId(idFromMessage)
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
      !id
    ) {
      setError({
        error: "Authorization rejected",
        errorDescription:
          "Please try again and authenticate your Discord account in the popup window",
      })
    }
  }, [error, id, prevWindowInstance, windowInstance, isAndroidBrowser])

  return {
    id,
    error,
    onOpen: (url: string) => {
      setError(null)
      onOpen(url)
    },
    isAuthenticating: !!windowInstance && !windowInstance.closed,
  }
}

export default useDCAuth
