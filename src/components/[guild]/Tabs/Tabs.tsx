import {
  Box,
  HStack,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import StickyEventListener from "sticky-event-listener"
import useGuild from "../hooks/useGuild"
import { useThemeContext } from "../ThemeContext"
import TabButton from "./components/TabButton"

type Props = {
  tabTitle: string
}

const Tabs = ({ tabTitle, children }: PropsWithChildren<Props>): JSX.Element => {
  const tabsRef = useRef()
  const [isSticky, setIsSticky] = useState(false)
  const { colorMode } = useColorMode()
  const { textColor } = useThemeContext()
  const tabButtonColor = isSticky && colorMode === "light" ? "black" : textColor

  const { urlName } = useGuild()
  const bgColor = useColorModeValue("white", "gray.800")
  const [lastScrollTop, setLastScrollTop] = useState(0)

  //   window.addEventListener("scroll", () => {
  //     const st = window.pageYOffset || document.documentElement.scrollTop
  //     if (st > lastScrollTop) {
  //       handleScroll(true)
  //     } else {
  //       handleScroll(false)
  //     }
  //     setLastScrollTop(st <= 0 ? 0 : st) // For Mobile or negative scrolling
  //   })

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll)
  //   }
  // }, [])

  // useEffect(() => {
  //   const current = tabsRef.current || null
  //   const defaultOffsetTop = current.offsetTop
  //   console.info(defaultOffsetTop)
  //   const handleScroll = () => {
  //     const rect = current.offsetTop
  //     console.info(rect)
  //     //console.info(current.position.top)
  //     //console.info(current)
  //     setIsSticky(rect > defaultOffsetTop)
  //   }

  //   window.addEventListener("scroll", handleScroll)

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll)
  //   }
  // }, [])

  // useEffect(() => {
  //   const current = tabsRef.current || null
  //   const observer = new IntersectionObserver(
  //     ([e]) => {
  //       console.info(e)
  //       if (e.intersectionRatio < 1) {
  //         setIsSticky(true)
  //       } else setIsSticky(false)
  //     },
  //     { threshold: [1] }
  //   )

  //   observer.observe(current)
  // }, [])

  // useEffect(() => {
  //   const current = tabsRef.current || null
  //   window.requestAnimationFrame(() => {
  //     current.scrollTo({ left: 100, behavior: "smooth" })
  //   })
  //   setTimeout(() => (current.style.overflow = "hidden"), 500)
  // }, [])
  // const { ref, inView } = useInView({ threshold: 1 })

  // useEffect(() => {
  //   document.querySelector('#tabsRef')
  //   console.log((Element.box.parentNode).querySelector('#tabsRef'))
  // }, [])

  useEffect(() => {
    const current = tabsRef.current || null
    new StickyEventListener(current)
    // console.log(sticker)
    function onScroll() {
      current.addEventListener("sticky", (event) => {
        console.log(event.detail.stuck)
      })
    }
    current.addEventListener("sticky", onScroll)
    return function unMount() {
      window.removeEventListener("sticky", onScroll)
    }
  }, [])

  return (
    <Stack
      ref={tabsRef}
      id="tabsRef"
      direction="row"
      justifyContent="space-between"
      alignItems={"center"}
      position="sticky"
      top={0}
      py={3}
      mt={-3}
      mb={2}
      width="full"
      zIndex="banner"
      _before={{
        content: `""`,
        position: "fixed",
        top: 0,
        left: 0,
        width: "full",
        // button height + padding
        height: "calc(var(--chakra-space-11) + (2 * var(--chakra-space-3)))",
        bgColor: bgColor,
        boxShadow: "md",
        transition: "opacity 0.2s ease, visibility 0.1s ease",
        visibility: isSticky ? "visible" : "hidden",
        opacity: isSticky ? 1 : 0,
      }}
    >
      <Box
        position="relative"
        ml={-8}
        minW="0"
        sx={{
          "-webkit-mask-image":
            "linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent)",
        }}
      >
        <HStack
          overflowX="auto"
          px={8}
          color={tabButtonColor}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
        >
          <TabButton href={`${urlName}`}>{tabTitle}</TabButton>
          {/* <TabButton href="#" disabled tooltipText="Stay tuned!">
            More tabs soon
          </TabButton> */}
        </HStack>
      </Box>

      <Box
        color={tabButtonColor}
        sx={{
          "> *": {
            color: tabButtonColor,
          },
        }}
      >
        {children}
      </Box>
    </Stack>
  )
}

export default Tabs
