import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"

const useIsStuck = () => {
  const ref = useRef(null)
  const [isStuck, setIsStuck] = useState(false)
  const { isReady } = useRouter()

  useEffect(() => {
    const cachedRef = ref.current
    const topOffsetPx = parseInt(getComputedStyle(cachedRef).top) + 1

    const observer = new IntersectionObserver(
      ([e]) => {
        setIsStuck(!e.isIntersecting && e.boundingClientRect.top < topOffsetPx)
      },
      { threshold: [1], rootMargin: `-${topOffsetPx}px 0px 0px 0px` }
    )
    observer.observe(cachedRef)
    return () => observer.unobserve(cachedRef)
  }, [ref, isReady])

  return { ref, isStuck }
}

export default useIsStuck
