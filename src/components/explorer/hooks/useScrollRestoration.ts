import { useRouter } from "next/router"
import { useEffect, useRef } from "react"

const scrollPositions = new Map()

/**
 * Used for scroll restoration when navigating to the page - works for "Back to
 * explorer" button too, not just native back navigation.
 *
 * It's complex and doesn't work reliably tho, we should check if we can prevent the
 * layout shift caused by the dynamically loaded Your guilds section, and just use
 * native scroll restoration again. To keep the functionality for the "Back to
 * explorer" button too, we could apply a logic there to not push the router but go
 * back if the previous route was explorer. It would also be great because now if we
 * search for something, then go back by the button, the scroll restoration takes us
 * to a random place
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
  const previousPathname = useRef(null)

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      const pathname = url.split("?")[0]

      if (previousPathname.current != pathname)
        scrollPositions.set(router.asPath, window.scrollY)

      previousPathname.current = pathname
    }

    const handleRouteChangeComplete = (url: string) => {
      const pathname = url.split("?")[0]
      if (previousPathname.current == pathname) return

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
  }, [router, active, onRestore])
}

export default useScrollRestoration
