import { useLayoutEffect, useRef } from "react"

const useContainerRef = () => {
  const containerRef = useRef(null)

  useLayoutEffect(() => {
    containerRef.current = document.querySelector(".colorPaletteProvider")
  }, [])

  return containerRef
}

export default useContainerRef
