import { MutableRefObject, useEffect, useRef, useState } from "react"

type LevelIndicatorState = "idle" | "focus" | "pending" | "access"

const useLevelIndicatorState = (
  hasAccess: boolean,
  isModalOpen: boolean
): [MutableRefObject<any>, MutableRefObject<any>, LevelIndicatorState] => {
  const hoverElement = useRef(null)
  const focusElement = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isDelayedModalOpen, setIsDelayedModalOpen] = useState(false)
  const [state, setState] = useState<LevelIndicatorState>("idle")

  /**
   * Delaying update on modal close so we can accurately determine if the level
   * should stay in focus state (the overlay is not blocking the mouse to be over the
   * element and the button could got it's focus back)
   */
  useEffect(() => {
    if (isModalOpen) setIsDelayedModalOpen(true)
    else
      setTimeout(() => {
        setIsDelayedModalOpen(false)
      }, 120)
  }, [isModalOpen])

  useEffect(() => {
    const hoverEl = hoverElement.current

    /**
     * We only want isFocused to be true if the user navigates with the keyboard
     * (data-focus-visible-added is added by the focus-visible polyfill)
     */
    const focusEnterHandler = () =>
      focusElement.current.hasAttribute("data-focus-visible-added") &&
      setIsFocused(true)

    const focusLeaveHandler = () => setIsFocused(false)
    const mouseEnterHandler = () => setIsHovered(true)
    const mouseLeaveHandler = () => setIsHovered(false)

    hoverEl.addEventListener("mouseenter", mouseEnterHandler)
    hoverEl.addEventListener("mouseleave", mouseLeaveHandler)
    hoverEl.addEventListener("focusin", focusEnterHandler)
    hoverEl.addEventListener("focusout", focusLeaveHandler)

    return () => {
      hoverEl.removeEventListener("mouseenter", mouseEnterHandler)
      hoverEl.removeEventListener("mouseleave", mouseLeaveHandler)
      hoverEl.removeEventListener("focusin", focusEnterHandler)
      hoverEl.removeEventListener("focusout", focusLeaveHandler)
    }
  }, [hoverElement, focusElement])

  useEffect(() => {
    if (hasAccess) {
      setState("access")
      return
    }
    if (isHovered || isFocused || isDelayedModalOpen) {
      setState("focus")
      return
    }
    setState("idle")
  }, [isHovered, isFocused, isDelayedModalOpen, hasAccess])

  return [hoverElement, focusElement, state]
}

export default useLevelIndicatorState
export type { LevelIndicatorState }
