import useUser from "components/[guild]/hooks/useUser"
import usePopupWindow from "hooks/usePopupWindow"
import { useCallback, useEffect, useState } from "react"
import handleMessage from "./utils/handleMessage"

const useDCAuth = () => {
  const { onOpen, windowInstance } = usePopupWindow()
  const [listener, setListener] = useState(null)
  const [error, setError] = useState(null)
  const [id, setId] = useState(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const { discordId: discordIdFromDb } = useUser()

  // If the popup is closed instantly that indicates, that we couldn't close it, probably opened as a different tab.
  const [closedInstantly, setClosedInstantly] = useState<boolean>(false)

  const onWindowClose = useCallback(() => {
    if (closedInstantly) return
    setError({
      error: "Authorization rejected",
      errorDescription:
        "Please try again and authenticate your Discord account in the popup window",
    })
  }, [closedInstantly])
  useEffect(() => {
    if (!windowInstance) return
    windowInstance.onclose = onWindowClose
  }, [windowInstance, onWindowClose])

  useEffect(() => {
    if (!windowInstance) return

    setClosedInstantly(false)

    setTimeout(() => {
      if (windowInstance.closed) {
        setClosedInstantly(true)
      }
    }, 500)
  }, [windowInstance])

  useEffect(() => {
    if (!windowInstance) return

    console.log("Setting isauthenticating to true")
    setIsAuthenticating(true)
    new Promise<{ id: string }>((resolve, reject) => {
      setListener(() => handleMessage(resolve, reject))
    })
      .then((d) => {
        console.log("Recieved data", d)
        setId(d?.id)
      })
      .catch((e) => {
        console.log("Recieved error", e)
        setError(e)
      })
      .finally(() => {
        console.log("Setting isauthenticating to false")
        setIsAuthenticating(false)
      })
  }, [windowInstance])

  useEffect(() => {
    if (!listener) return
    console.log("Attaching listener to window", listener, window)
    window.addEventListener("message", listener)
  }, [listener])

  return {
    id: typeof discordIdFromDb === "string" ? discordIdFromDb : id,
    error,
    onOpen: (url: string) => {
      setError(null)
      onOpen(url)
    },
    isAuthenticating,
  }
}

export default useDCAuth
