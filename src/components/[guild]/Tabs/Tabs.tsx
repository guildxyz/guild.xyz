import {
  Box,
  HStack,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import { PropsWithChildren, useRef, useState } from "react"
import useGuild from "../hooks/useGuild"
import { useThemeContext } from "../ThemeContext"
import TabButton from "./components/TabButton"

type Props = {
  tabTitle: string
}

const Tabs = ({ tabTitle, children }: PropsWithChildren<Props>): JSX.Element => {
  const tabsRef = useRef()
  const seged = useRef()
  const [isSticky, setIsSticky] = useState(false)
  const { colorMode } = useColorMode()
  const { textColor } = useThemeContext()
  const tabButtonColor = isSticky && colorMode === "light" ? "black" : textColor

  const { urlName } = useGuild()
  const bgColor = useColorModeValue("white", "gray.800")

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const current = tabsRef.current || null
  //     const rect = current?.getBoundingClientRect()

  //     setIsSticky(rect?.top <= 0)
  //   }

  //   window.addEventListener("scroll", handleScroll)

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll)
  //   }
  // }, [])

  //const current = tabsRef.current || null
  // useEffect(() => {
  //   document.documentElement.style.setProperty("--visibility", "hidden")
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       //console.info(entries[0].intersectionRatio)
  //       // no intersection with screen
  //       if (entries[0].intersectionRatio === 0) current.classList.add("data-before")
  //       // fully intersects with screen
  //       else if (entries[0].intersectionRatio === 1)
  //         current.classList.remove("data-before")
  //       // fully intersects with screen
  //       //else if (entries[0].intersectionRatio === 1) setIsSticky(false)
  //     },
  //     { threshold: 0 }
  //   )
  //   observer.observe(seged.current)
  // }, [])

  // useEffect(() => {
  //   const current = tabsRef.current || null
  //   const observer = new IntersectionObserver(
  //     ([e]) => {
  //       console.info(e)
  //       if (e.intersectionRatio < 1) {
  //       } else document.documentElement.style.setProperty("--visibility", "hidden")
  //     },
  //     { threshold: [1] }
  //   )

  //   observer.observe(current)
  // }, [])

  return (
    <>
      {/* <Box ref={seged} mt={-3} mb={2} zIndex={1000} h="0px" visibility="hidden" /> */}
      {/* {console.info(isSticky)} */}
      <Stack
        ref={tabsRef}
        direction="row"
        justifyContent="space-between"
        alignItems={"center"}
        position="sticky"
        top="-1px"
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
          //transition: "opacity 0.2s ease, visibility 0.1s ease",
          visibility: "hidden",
          opacity: 1,
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
    </>
  )
}

export default Tabs
