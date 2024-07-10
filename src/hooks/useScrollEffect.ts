import { useCallback, useEffect } from "react"

const useScrollEffect = (
  callback: () => void,
  deps: any[] = [],
  listenerOptions?: AddEventListenerOptions,
  element = typeof document !== "undefined" && document
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const listener = useCallback(callback, deps)

  useEffect(() => {
    if (!element) return
    element.addEventListener("scroll", listener, listenerOptions)
    return () => {
      element.removeEventListener("scroll", listener, listenerOptions)
    }
  }, [element, listener, listenerOptions])
}

export default useScrollEffect
