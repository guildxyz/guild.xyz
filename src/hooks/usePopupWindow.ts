import { useRef } from "react"

const usePopupWindow = (windowClosedCheckIntervalMs = 1000) => {
  const closedInFirstInterval = useRef<boolean>(null)
  const windowInstance = useRef<Window>(null)

  const onOpen = (uri: string) => {
    windowInstance.current = window.open(
      uri,
      "_blank",
      "height=750,width=600,scrollbars"
    )

    closedInFirstInterval.current = null
    const timer = setInterval(() => {
      if (windowInstance.current.closed) {
        if (closedInFirstInterval.current === null) {
          closedInFirstInterval.current = true
        }
        windowInstance.current = null
        clearInterval(timer)
      } else {
        if (closedInFirstInterval.current === null) {
          closedInFirstInterval.current = false
        }
      }
    }, windowClosedCheckIntervalMs)
  }

  return {
    onOpen,
    windowInstance: windowInstance.current,
    closedInFirstInterval: closedInFirstInterval.current,
  }
}

export default usePopupWindow
