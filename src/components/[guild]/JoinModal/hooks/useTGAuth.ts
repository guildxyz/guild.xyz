import usePopupWindow from "hooks/usePopupWindow"
import useToast from "hooks/useToast"
import { useEffect, useState } from "react"
import processDiscordError from "../utils/processDiscordError"

const TG_WIDGET_WIDTH = 345
const TG_WIDGET_HEIGHT = 100
const TG_WIDGET_PADDING = 10

const useTGAuth = () => {
  const [telegramId, setTelegramId] = useState<string>(null)
  const [authData, setAuthData] = useState(null)
  const [error, setError] = useState(null)

  const toast = useToast()

  const { onOpen, windowInstance } = usePopupWindow(
    `${process.env.NEXT_PUBLIC_TELEGRAM_POPUP_URL}?openerOrigin=${encodeURIComponent(
      typeof window !== "undefined" ? window?.location.origin : "https://guild.xyz"
    )}`,
    {
      width: TG_WIDGET_WIDTH + 2 * TG_WIDGET_PADDING,
      height: TG_WIDGET_HEIGHT + 2 * TG_WIDGET_PADDING,
    }
  )

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
        // event.origin === windowInstance.location.origin &&
        typeof event.data === "object" &&
        "type" in event.data &&
        "data" in event.data
      ) {
        const { data, type } = event.data

        switch (type) {
          case "TG_AUTH_SUCCESS":
            setAuthData(data)
            setTelegramId(data.id?.toString())
            break
          case "TG_AUTH_ERROR":
            setError(data)
            const { title, description } = processDiscordError(data)
            toast({ status: "error", title, description })
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
    authData,
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
