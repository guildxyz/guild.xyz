import { useState } from "react"
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect"

const useWindowSize = (): [number, number] => {
  const [size, setSize] = useState<[number, number]>([0, 0])

  useIsomorphicLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight])
    }

    window.addEventListener("resize", updateSize)
    updateSize()

    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return size
}

export default useWindowSize
