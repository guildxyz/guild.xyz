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
    const dualScreenLeft = window.screenLeft ?? window.screenX
    const dualScreenTop = window.screenTop ?? window.screenY

    const width =
      window.innerWidth ?? document.documentElement.clientWidth ?? screen.width
    const height =
      window.innerHeight ?? document.documentElement.clientHeight ?? screen.height

    const systemZoom = width / window.screen.availWidth
    const left = (width - windowFeatures.width) / 2 / systemZoom + dualScreenLeft
    const top = (height - windowFeatures.height) / 2 / systemZoom + dualScreenTop

    windowFeatures.left = windowFeatures.left ?? left
    windowFeatures.top = windowFeatures.top ?? top

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
