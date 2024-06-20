import { useState } from "react"

const useCountdownSeconds = (seconds?: number, onCountdown?: () => void) => {
  const [sec, setSec] = useState(seconds ?? 0)
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout>()
  const [isCountingDown, setIsCountingDown] = useState(false)

  const stop = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
    }
  }

  return {
    start: (s?: number) => {
      stop()
      if (typeof s === "number") {
        setSec(s)
      }
      setIsCountingDown(true)

      const interval = setInterval(() => {
        setSec((prev) => {
          const newVal = prev - 1
          if (newVal <= 0) {
            setIsCountingDown(false)
            if (typeof seconds === "number") {
              setSec(seconds)
            }
            clearInterval(interval)
            onCountdown?.()
          }
          return newVal
        })
      }, 1000)

      setCountdownInterval(interval)
    },
    seconds: sec,
    isCountingDown,
    stop,
  }
}

export default useCountdownSeconds
