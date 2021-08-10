import { useEffect, useRef } from "react"

const usePrevious = <T>(value: T): T => {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  // return previous value (happens before update in useEffect above)
  return ref.current
}

export default usePrevious
