import { useRef } from "react"

/**
 * If the returned windowInstance is null, it has been closed, if it is undefined, we
 * were unable to track, if it's open or not.
 */
const usePopupWindow = (windowClosedCheckIntervalMs = 1000) => {
  const windowInstance = useRef<Window>(null)

  const onOpen = (uri: string) => {
    windowInstance.current = window.open(
      uri,
      "_blank",
      "height=750,width=600,scrollbars"
    )

    const timer = setInterval(() => {
      if (windowInstance.current === null) {
        windowInstance.current = undefined
      } else if (windowInstance.current.closed) {
        windowInstance.current = null
        clearInterval(timer)
      }
    }, windowClosedCheckIntervalMs)
  }

  return {
    onOpen,
    windowInstance: windowInstance.current,
  }
}

export default usePopupWindow
