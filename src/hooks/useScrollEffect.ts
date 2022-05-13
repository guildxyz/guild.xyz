import { useCallback, useEffect } from "react"

const useScrollEffect = (
  callback: () => void,
  deps: any[] = [],
  listenerOptions?: AddEventListenerOptions
) => {
  const listener = useCallback(callback, deps)

  useEffect(() => {
    if (!document) return
    document.addEventListener("scroll", listener, listenerOptions)
    return () => {
      document.removeEventListener("scroll", listener, listenerOptions)
    }
  }, [listener])
}

export default useScrollEffect
