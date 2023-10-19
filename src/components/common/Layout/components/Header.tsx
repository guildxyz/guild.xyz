import { Box, Flex, useColorMode } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import dynamic from "next/dynamic"
import NavMenu from "../components/NavMenu"

const DynamicAccount = dynamic(() => import("./Account"), { ssr: false })

const Header = (): JSX.Element => {
  const colorContext = useThemeContext()
  const { colorMode } = useColorMode()

  return (
    <Flex
      position="relative"
      w="full"
      justifyContent="space-between"
      alignItems="center"
      p="2"
      zIndex="overlay"
      // temporary
      sx={{
        "[aria-label]": {
          color:
            colorMode === "light"
              ? colorContext?.textColor === "whiteAlpha.900" || !colorContext
                ? "whiteAlpha.900"
                : "gray.900"
              : undefined,
        },
      }}
    >
      <NavMenu />
      <Box>{typeof window !== "undefined" && <DynamicAccount />}</Box>
    </Flex>
  )
}

export default Header
