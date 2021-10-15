import { Box, Flex, HStack, Icon, IconButton } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import NextLink from "next/link"
import { House } from "phosphor-react"
import React from "react"
import Account from "../components/Account"
import InfoMenu from "../components/InfoMenu"

type Props = {
  whiteButtons?: boolean
}

const Header = ({ whiteButtons }: Props): JSX.Element => {
  const router = useRouter()

  return (
    <Flex
      position="relative"
      w="full"
      justifyContent="space-between"
      alignItems="center"
      p="2"
    >
      {router?.asPath !== "/" ? (
        <NextLink passHref href="/">
          <IconButton
            as="a"
            aria-label="Home"
            variant={whiteButtons ? "solid" : "ghost"}
            isRound
            h="10"
            icon={<Icon width="1.2em" height="1.2em" as={House} />}
          />
        </NextLink>
      ) : (
        <Box />
      )}
      <HStack spacing="2">
        <Account white />
        <InfoMenu white />
      </HStack>
    </Flex>
  )
}

export default Header
