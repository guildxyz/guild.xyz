import { useEffect, useRef, useState } from "react"

const useDebouncedState = <T>(state: T, delayMs = 500): T => {
  const [delayedState, setDelayedState] = useState(state)
  const timeout = useRef<number | null>(null)

  useEffect(() => {
    if (timeout.current) window.clearTimeout(timeout.current)

    timeout.current = window.setTimeout(() => setDelayedState(state), delayMs)
  }, [state, delayMs])

  return delayedState
}

export default useDebouncedState
