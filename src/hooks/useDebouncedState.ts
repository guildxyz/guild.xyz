import { useEffect, useRef, useState } from "react"

const useDebouncedState = (state: any, delayMs = 500) => {
  const [delayedState, setDelayedState] = useState(state)
  const timeout = useRef(null)

  useEffect(() => {
    if (timeout.current) window.clearTimeout(timeout.current)

    timeout.current = setTimeout(() => setDelayedState(state), delayMs)
  }, [state, delayMs])

  return delayedState
}

export default useDebouncedState
