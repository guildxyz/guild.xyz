import { useEffect, useState } from "react"

type WindowFeatures = Partial<{
  width: number
  height: number
  left: number
  top: number
  popup: boolean
  noopener: boolean
  noreferrer: boolean
  scrollbars: boolean
}>

const defaultWindowFeatures = {
  width: 600,
  height: 750,
  scrollbars: true,
}

const usePopupWindow = (
  uri: string,
  windowFeatures: WindowFeatures = defaultWindowFeatures
) => {
  const [windowInstance, setWindowInstance] = useState<Window>(null)

  const onOpen = () => {
    setWindowInstance(
      window.open(
        uri,
        "_blank",
        Object.entries({ ...defaultWindowFeatures, ...windowFeatures })
          .map(([key, value]) =>
            typeof value === "number" ? `${key}=${value}` : key
          )
          .join(",")
      )
    )
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
