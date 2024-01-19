import { useState } from "react"

const useCountdownSeconds = (seconds: number) => {
  const [sec, setSec] = useState(seconds)

  return {
    start: () => {
      let interval: NodeJS.Timeout

      setInterval(() => {
        setSec((prev) => {
          const newVal = prev - 1
          if (newVal <= 0) {
            clearInterval(interval)
          }
          return newVal
        })
      }, 1000)
    },
    seconds: sec,
  }
}

export default useCountdownSeconds
