import { usePrevious } from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import usePopupWindow from "hooks/usePopupWindow"
import { useEffect, useState } from "react"
import handleMessage from "./utils/handleMessage"

const useDCAuth = () => {
  const { onOpen, windowInstance } = usePopupWindow(200)
  const prevWindowInstance = usePrevious(windowInstance)
  const [listener, setListener] = useState(null)
  const [error, setError] = useState(null)
  const [id, setId] = useState(null)

  const { discordId: discordIdFromDb } = useUser()

  // If the popup is closed instantly that indicates, that we couldn't close it, probably opened as a different tab.
  const [closedInstantly, setClosedInstantly] = useState<boolean>(false)

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

    // TODO: Test if this is needed
    setClosedInstantly(false)
    setTimeout(() => {
      if (windowInstance.closed) {
        setClosedInstantly(true)
      }
    }, 500)
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
      !closedInstantly &&
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
  }, [error, id, prevWindowInstance, windowInstance, closedInstantly])

  return {
    id: typeof discordIdFromDb === "string" ? discordIdFromDb : id,
    error,
    onOpen: (url: string) => {
      setError(null)
      onOpen(url)
    },
    isAuthenticating:
      (!!windowInstance && !windowInstance.closed) ||
      (closedInstantly && !error && !id),
  }
}

export default useDCAuth
