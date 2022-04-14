import { Flex, HStack, Icon, IconButton, Img, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import LinkButton from "components/common/LinkButton"
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

  const { colorMode } = useColorMode()

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
      {router.route !== "/" ? (
        !router.components?.["/"] ? (
          <NextLink passHref href="/">
            <IconButton
              as="a"
              aria-label="Home"
              variant="ghost"
              isRound
              h="10"
              icon={<Icon width="1.1em" height="1.1em" as={House} />}
            />
          </NextLink>
        ) : (
          <IconButton
            aria-label="Go back"
            variant="ghost"
            isRound
            h="10"
            icon={<Icon width="1.1em" height="1.1em" as={ArrowLeft} />}
            onClick={() => router.back()}
          />
        )
      ) : (
        <Card
          bg={colorMode === "light" ? "blackAlpha.400" : "blackAlpha.300"}
          boxShadow="none"
          overflow="visible"
        >
          <LinkButton
            href="/?view=landing"
            borderRadius="2xl"
            colorScheme="alpha"
            color="whiteAlpha.900"
            leftIcon={
              <Img
                src="/guildLogos/logo.svg"
                alt="Guild logo"
                boxSize={4}
                mt={-1.5}
              />
            }
          >
            About
          </LinkButton>
        </Card>
      )}
      <HStack spacing="2" ml="auto">
        <Account />
        <InfoMenu />
      </HStack>
    </Flex>
  )
}

export default Header
