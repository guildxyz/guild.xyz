import { useEffect, useRef, useState } from "react"

/**
 * The IntersectionObserver triggers if the element is off the viewport, so we have
 * to set top="-1px" or bottom="-1px" on the sticky element instead of 0
 */
const useIsStuck = () => {
  const ref = useRef(null)
  const [isStuck, setIsStuck] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const cachedRef = ref.current
    const topOffsetPx = parseInt(getComputedStyle(cachedRef).top) + 1
    const bottomOffsetPx = parseInt(getComputedStyle(cachedRef).bottom) + 1

    const observer = new IntersectionObserver(
      ([e]) => {
        setIsStuck(
          !e.isIntersecting &&
            (e.boundingClientRect.top < topOffsetPx ||
              e.boundingClientRect.bottom > bottomOffsetPx)
        )
      },
      {
        threshold: [1],
        rootMargin: `-${topOffsetPx || 0}px 0px 0px ${bottomOffsetPx || 0}px`,
      }
    )
    observer.observe(cachedRef)
    return () => observer.unobserve(cachedRef)
  }, [ref])

  return { ref, isStuck }
}

export default useIsStuck
