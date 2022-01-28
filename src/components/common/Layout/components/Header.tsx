import { Flex, HStack, Icon, IconButton } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { useRouter } from "next/dist/client/router"
import NextLink from "next/link"
import { ArrowLeft, House } from "phosphor-react"
import React from "react"
import Account from "../components/Account"
import InfoMenu from "../components/InfoMenu"

const Header = (): JSX.Element => {
  const router: any = useRouter()
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
    >
      {router.route !== "/" && (
        <NextLink passHref href="/">
          <IconButton
            as="a"
            aria-label="Home"
            variant="ghost"
            isRound
            h="10"
            icon={
              <Icon
                width="1.1em"
                height="1.1em"
                as={!router.components?.["/"] ? House : ArrowLeft}
              />
            }
          />
        </NextLink>
      )}
      <HStack spacing="2" ml="auto">
        <Account />
        <InfoMenu />
      </HStack>
    </Flex>
  )
}

export default Header
