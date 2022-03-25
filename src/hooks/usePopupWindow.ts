import { useEffect, useState } from "react"

const usePopupWindow = () => {
  const [windowInstance, setWindowInstance] = useState<Window>(null)

  const onOpen = (uri: string) => {
    setWindowInstance(window.open(uri, "_blank", "height=750,width=600,scrollbars"))
  }

  useEffect(() => {
    if (!windowInstance) return
    const timer = setInterval(() => {
      if (windowInstance.closed) {
        setWindowInstance(null)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [windowInstance])

  return {
    onOpen,
    windowInstance,
  }
}

export default usePopupWindow
