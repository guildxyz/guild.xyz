import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"

/**
 * This works well with initial scroll too (like going back with scrollRestoration),
 * but returns true for elements that're not yet stuck, just below the viewport yet.
 * Have to set `top: -1px` on the sticky elements
 */
const useIsStuck = () => {
  const ref = useRef(null)
  const [isStuck, setIsStuck] = useState(false)
  const { isReady } = useRouter()

  useEffect(() => {
    const cachedRef = ref.current

    const observer = new IntersectionObserver(
      ([e]) => setIsStuck(e.intersectionRatio < 1),
      { threshold: [1] }
    )
    observer.observe(cachedRef)
    return () => observer.unobserve(cachedRef)
  }, [ref, isReady])

  return { ref, isStuck }
}

/**
 * This doesn't work well with initial scroll, but works with initially
 * below-the-fold elements. View references to see why we've kept it
 */
export const useIsStuckLegacy = () => {
  const ref = useRef(null)
  const [isStuck, setIsStuck] = useState(false)

  useEffect(() => {
    const current = ref.current || null
    const defaultOffsetTop = window.pageYOffset + current.getBoundingClientRect().top

    const handleScroll = () => {
      const scroll = document.documentElement.scrollTop
      setIsStuck(scroll > defaultOffsetTop)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return { ref, isStuck }
}

export default useIsStuck
