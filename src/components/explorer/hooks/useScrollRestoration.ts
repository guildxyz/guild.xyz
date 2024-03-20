import { useRouter } from "next/router"
import { useEffect } from "react"

const scrollPositions = new Map()

/**
 * Used for scroll restoration when navigating to the page. FOR ALL NAVIGATIONS, NOT
 * ONLY FOR BACKWARDS NAVIGATION!
 *
 * @param param0
 */
const useScrollRestoration = ({
  active = true,
  onRestore,
}: {
  active?: boolean
  onRestore?: () => void
}) => {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (router.asPath === url) return
      scrollPositions.set(router.asPath, window.scrollY)
    }

    const handleRouteChangeComplete = () => {
      const savedPosition = scrollPositions.get(router.asPath) || 0

      if (!active) {
        if (!!onRestore) onRestore()
        return
      }
      /**
       * For some reason, without the delay, the scrolling is not executed. It might
       * be caused by the default 'scrollRestoration', which probably overwrites our
       * own scrolling, if not delayed.
       */
      setTimeout(() => {
        window.scrollTo({
          top: savedPosition,
          left: 0,
        })
      }, 10)
      if (!!onRestore) onRestore()
    }

    router.events.on("routeChangeStart", handleRouteChangeStart)
    router.events.on("routeChangeComplete", handleRouteChangeComplete)

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart)
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [router, scrollPositions, active, onRestore])
}

export default useScrollRestoration
