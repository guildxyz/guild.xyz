import { Box, Flex, HStack, Icon, IconButton } from "@chakra-ui/react"
import { useColorContext } from "components/common/ColorContext"
import { useRouter } from "next/dist/client/router"
import NextLink from "next/link"
import { ArrowLeft, House } from "phosphor-react"
import React, { useEffect, useState } from "react"
import Account from "../components/Account"
import InfoMenu from "../components/InfoMenu"

const Header = (): JSX.Element => {
  const router: any = useRouter()
  const [prevRoute, setPrevRoute] = useState(null)
  const colorContext = useColorContext()

  useEffect(() => {
    const handleRouteChange = (url: string, { shallow }) => {
      if (!shallow) setPrevRoute(url)
    }
    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [])

  return (
    <Flex
      position="relative"
      w="full"
      justifyContent="space-between"
      alignItems="center"
      p="2"
    >
      {router.route !== "/" || !router.components?.["/"] ? (
        <HStack
          spacing={2}
          // temporary
          color={
            colorContext?.localThemeMode
              ? colorContext?.textColor === "whiteAlpha.900"
                ? "whiteAlpha.900"
                : "gray.900"
              : undefined
          }
        >
          {prevRoute && (
            <IconButton
              as="a"
              aria-label="Home"
              variant="ghost"
              isRound
              h="10"
              icon={<Icon width="1.1em" height="1.1em" as={ArrowLeft} />}
              cursor="pointer"
              onClick={() => router.back()}
            />
          )}

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
        </HStack>
      ) : (
        <Box />
      )}
      <HStack spacing="2">
        <Account />
        <InfoMenu />
      </HStack>
    </Flex>
  )
}

export default Header
