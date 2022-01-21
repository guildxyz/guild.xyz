import { useEffect } from "react"

const useScrollEffect = (callback) => {
  useEffect(() => {
    document?.addEventListener?.("scroll", callback)
    return () => {
      document?.removeEventListener?.("scroll", callback)
    }
  }, [callback])
}

export default useScrollEffect
