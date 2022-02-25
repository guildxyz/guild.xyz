import { Flex, HStack, IconButton } from "@chakra-ui/react"
import FlavorIcon from "components/create-guild/Requirements/components/FlavorIcon"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { useRouter } from "next/dist/client/router"
import NextLink from "next/link"
import React from "react"
import Account from "./Account"

const Header = (): JSX.Element => {
  const router: any = useRouter()
  const colorContext = useThemeContext()

  return (
    <Flex
      position="relative"
      w="full"
      justifyContent="space-between"
      alignItems="end"
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
    >
      {router.route !== "/" && (
        <NextLink passHref href="/">
          <IconButton
            as="a"
            aria-label="Home"
            variant="ghost"
            // h="10"
            h="10"
            w="1000"
            icon={<FlavorIcon />}
          />
        </NextLink>
      )}
      <HStack spacing="4" ml="auto" marginTop="2">
        <Account />
        {/* <InfoMenu /> */}
      </HStack>
    </Flex>
  )
}

export default Header
