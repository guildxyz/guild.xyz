import usePopupWindow from "hooks/usePopupWindow"
import { useEffect, useState } from "react"

const useTGAuth = () => {
  const { onOpen, windowInstance } = usePopupWindow("/tgauth")

  const [telegramId, setTelegramId] = useState<string>(null)
  const [error, setError] = useState(null)

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
          case "TG_AUTH_SUCCESS":
            setTelegramId(data?.id)
            break
          case "TG_AUTH_ERROR":
            setError(data)
            // TODO: error handling
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
    telegramId,
    error,
    onOpen: () => {
      setError(null)
      onOpen()
    },
    isAuthenticating: !!windowInstance && !windowInstance.closed,
  }
}

export default useTGAuth
