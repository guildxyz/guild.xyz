import Router from "next/router"
import { useEffect } from "react"

const useWarnIfUnsavedChanges = (unsavedChanges: boolean) => {
  useEffect(() => {
    const confirmationMessage = "Changes you made may not be saved."

    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      ;(e || window.event).returnValue = confirmationMessage
      return confirmationMessage // Gecko + Webkit, Safari, Chrome etc.
    }

    const beforeRouteHandler = (url: string) => {
      // eslint-disable-next-line no-restricted-globals
      if (Router.pathname !== url && !confirm(confirmationMessage)) {
        Router.events.emit("routeChangeError")
        throw new Error("Abort route change. Please ignore this error.")
      }
    }

    if (unsavedChanges) {
      window.addEventListener("beforeunload", beforeUnloadHandler)
      Router.events.on("routeChangeStart", beforeRouteHandler)
    } else {
      window.removeEventListener("beforeunload", beforeUnloadHandler)
      Router.events.off("routeChangeStart", beforeRouteHandler)
    }
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler)
      Router.events.off("routeChangeStart", beforeRouteHandler)
    }
  }, [unsavedChanges])
}

export default useWarnIfUnsavedChanges
