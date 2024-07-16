import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react"

/**
 * The IntersectionObserver triggers if the element is off the viewport, so we have
 * to set top="-1px" or bottom="-1px" on the sticky element instead of 0
 */
const useIsStuck = (
  setIsStuck?: Dispatch<SetStateAction<boolean>>
): { ref: MutableRefObject<null>; isStuck?: boolean } => {
  const ref = useRef(null)
  const [isStuck, setIsStuckLocal] = useState(false)
  const setIsStuckActive = setIsStuck ?? setIsStuckLocal

  useEffect(() => {
    if (!ref.current) return
    const cachedRef = ref.current
    const topOffsetPx = parseInt(getComputedStyle(cachedRef).top) + 1
    const bottomOffsetPx = parseInt(getComputedStyle(cachedRef).bottom) + 1

    const observer = new IntersectionObserver(
      ([e]) => {
        setIsStuckActive(
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

  return { ref, isStuck: setIsStuck ? undefined : isStuck }
}

export default useIsStuck
