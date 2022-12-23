import { Box, Flex } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import Account from "../components/Account"
import NavMenu from "../components/NavMenu"

const Header = (): JSX.Element => {
  const colorContext = useThemeContext()

  return (
    <Flex
      position="relative"
      w="full"
      justifyContent="space-between"
      alignItems="center"
      p="2"
      // temporary
      sx={{
        "[aria-label]": {
          color: colorContext?.localThemeMode
            ? colorContext?.textColor === "whiteAlpha.900"
              ? "whiteAlpha.900"
              : "gray.900"
            : undefined,
        },
      }}
      zIndex="docked"
    >
      <NavMenu />
      <Box>
        <Account />
      </Box>
    </Flex>
  )
}

export default Header
