import { useEffect, useState } from "react"

const useWindowSize = () => {
  const initialData =
    typeof window === "undefined"
      ? { height: 0, width: 0 }
      : {
          width: window.innerWidth,
          height: window.innerHeight,
        }

  const [windowSize, setWindowSize] = useState(initialData)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return windowSize
}

export default useWindowSize
