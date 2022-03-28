import { useEffect, useState } from "react"

const usePopupWindow = (windowClosedCheckIntervalMs = 1000) => {
  const [closedInFirstInterval, setClosedInFirstInterval] =
    useState<boolean>(undefined)
  const [windowInstance, setWindowInstance] = useState<Window>(null)

  const onOpen = (uri: string) => {
    setWindowInstance(() =>
      window.open(uri, "_blank", "height=750,width=600,scrollbars")
    )
  }

  useEffect(() => {
    if (!windowInstance) return
    setClosedInFirstInterval(undefined)
    const timer = setInterval(() => {
      if (windowInstance.closed) {
        if (closedInFirstInterval === undefined) {
          setClosedInFirstInterval(true)
        }
        setWindowInstance(null)
      } else {
        if (closedInFirstInterval === undefined) {
          setClosedInFirstInterval(false)
        }
      }
    }, windowClosedCheckIntervalMs)
    return () => clearInterval(timer)
  }, [windowInstance])

  return {
    onOpen,
    windowInstance,
    closedInFirstInterval,
  }
}

export default usePopupWindow
