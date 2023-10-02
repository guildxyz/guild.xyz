import { useCallback, useEffect } from "react"

const useScrollEffect = (
  callback: () => void,
  deps: any[] = [],
  listenerOptions?: AddEventListenerOptions,
  element = typeof document !== "undefined" && document
) => {
  const listener = useCallback(callback, deps)

  useEffect(() => {
    if (!element) return
    element.addEventListener("scroll", listener, listenerOptions)
    return () => {
      element.removeEventListener("scroll", listener, listenerOptions)
    }
  }, [listener])
}

export default useScrollEffect
