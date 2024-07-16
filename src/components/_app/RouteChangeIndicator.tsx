import {
  Box,
  Progress,
  Slide,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const RouteChangeIndicator = () => {
  const router = useRouter()
  const [isRouteChangeInProgress, setIsRouteChangeInProgress] = useState(false)

  const progressBgColor = useColorModeValue("blue.50", undefined)

  useEffect(() => {
    let previousPathname: string | null = null

    const handleRouteChangeStart = (url: string) => {
      const pathname = url.split("?")[0]
      if (previousPathname !== pathname) setIsRouteChangeInProgress(true)
      previousPathname = pathname
    }
    const handleRouteChangeComplete = () => setIsRouteChangeInProgress(false)

    router.events.on("routeChangeStart", handleRouteChangeStart)
    router.events.on("routeChangeComplete", handleRouteChangeComplete)

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart)
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isRouteChangeInProgress)
    return (
      <Slide
        direction="top"
        in={isRouteChangeInProgress}
        initial="0.3s"
        style={{ zIndex: 2000 }}
      >
        <Box position="relative" w="100%" h="5px" zIndex={2}>
          <Progress
            isIndeterminate
            w="100%"
            bg={progressBgColor}
            position="fixed"
            size="xs"
            transition="width .3s"
          />
        </Box>
      </Slide>
    )

  return null
}
export default RouteChangeIndicator
