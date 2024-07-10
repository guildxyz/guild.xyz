import { useState } from "react"

const useCountdownSeconds = (seconds: number) => {
  const [sec, setSec] = useState(seconds)
  const [isCountingDown, setIsCountingDown] = useState(false)

  return {
    start: () => {
      setIsCountingDown(true)

      const interval = setInterval(() => {
        setSec((prev) => {
          const newVal = prev - 1
          if (newVal <= 0) {
            setIsCountingDown(false)
            setSec(seconds)
            clearInterval(interval)
          }
          return newVal
        })
      }, 1000)
    },
    seconds: sec,
    isCountingDown,
  }
}

export default useCountdownSeconds
