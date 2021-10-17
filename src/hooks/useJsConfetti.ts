import JSConfetti from "js-confetti"
import { useEffect, useRef } from "react"

const useJsConfetti = () => {
  const jsConfetti = useRef(null)

  useEffect(() => {
    if (!jsConfetti.current) {
      jsConfetti.current = new JSConfetti()
    }
  }, [])

  const triggerConfetti = () =>
    jsConfetti.current?.addConfetti({
      confettiColors: [
        "#6366F1",
        "#22c55e",
        "#ef4444",
        "#3b82f6",
        "#fbbf24",
        "#f472b6",
      ],
    })

  return triggerConfetti
}

export default useJsConfetti
