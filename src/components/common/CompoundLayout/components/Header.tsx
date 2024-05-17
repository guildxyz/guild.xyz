import { Box, Flex, useColorMode } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import ClientOnly from "components/common/ClientOnly"
import NavMenu from "../components/NavMenu"
import Account from "./Account"

export const Header = (): JSX.Element => {
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
        ".navMenu": {
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

      <Box>
        <ClientOnly>
          <Account />
        </ClientOnly>
      </Box>
    </Flex>
  )
}
