import { useEffect, useRef, useState } from "react"

const useIsStuck = () => {
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
