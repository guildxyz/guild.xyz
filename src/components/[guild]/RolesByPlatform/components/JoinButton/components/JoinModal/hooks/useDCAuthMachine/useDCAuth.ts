import { usePrevious } from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import usePopupWindow from "hooks/usePopupWindow"
import { useEffect, useState } from "react"
import handleMessage from "./utils/handleMessage"

const useDCAuth = () => {
  const { onOpen, windowInstance } = usePopupWindow()
  const prevWindowInstance = usePrevious(windowInstance)
  const [listener, setListener] = useState(null)
  const [error, setError] = useState(null)
  const [id, setId] = useState(null)

  // This way we can detect and handle MetaMask's built-in browser
  const isAndroidBrowser = /android sdk/i.test(window?.navigator?.userAgent ?? "")

  const { discordId: discordIdFromDb } = useUser()

  /** On a window creation, we set a new listener */
  useEffect(() => {
    if (!windowInstance) return
    setListener(() =>
      handleMessage(
        (d) => {
          windowInstance?.close()
          setId(d?.id)
        },
        (e) => {
          windowInstance?.close()
          setError(e)
        }
      )
    )
  }, [windowInstance])

  /** When the listener has been set (to state), we attach it to the window */
  useEffect(() => {
    if (!listener) return
    window.addEventListener("message", listener)
    return () => window.removeEventListener("message", listener)
  }, [listener])

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
    idKnownOnBackend: discordIdFromDb,
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
