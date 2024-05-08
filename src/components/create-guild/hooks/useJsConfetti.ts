import JSConfetti from "js-confetti"
import { useCallback, useEffect, useRef } from "react"

const useJsConfetti = () => {
  const jsConfetti = useRef(null)
  const canvas = useRef(null)

  useEffect(() => {
    if (!canvas.current) {
      canvas.current = document.getElementById("js-confetti-canvas")
    }

    if (!jsConfetti.current && canvas.current) {
      jsConfetti.current = new JSConfetti({ canvas: canvas.current })
    }
  }, [])

  const triggerConfetti = useCallback(
    () =>
      jsConfetti.current?.addConfetti({
        confettiColors: [
          "#6366F1",
          "#22c55e",
          "#ef4444",
          "#3b82f6",
          "#fbbf24",
          "#f472b6",
        ],
      }),
    []
  )

  return triggerConfetti
}

export default useJsConfetti
