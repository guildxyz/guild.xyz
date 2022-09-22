import { useRouter } from "next/router"
import { useEffect, useRef } from "react"

// https://jak-ch-ll.medium.com/next-js-preserve-scroll-history-334cf699802a
const useScrollRestoration = () => {
  const router = useRouter()

  const scrollPositions = useRef<{ [url: string]: number }>({})
  const isBack = useRef(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual"
    }

    router.beforePopState(() => {
      isBack.current = true
      return true
    })

    const onRouteChangeStart = () => {
      const url = router.pathname
      scrollPositions.current[url] = window.scrollY
    }

    const onRouteChangeComplete = (url: any) => {
      if (isBack.current && scrollPositions.current[url]) {
        window.scroll({
          top: scrollPositions.current[url],
          behavior: "auto",
        })
      }

      isBack.current = false
    }

    router.events.on("routeChangeStart", onRouteChangeStart)
    router.events.on("routeChangeComplete", onRouteChangeComplete)

    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart)
      router.events.off("routeChangeComplete", onRouteChangeComplete)
    }
  }, [router])
}

export default useScrollRestoration
