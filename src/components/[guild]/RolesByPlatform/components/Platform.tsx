import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import { PlatformName } from "types"

type Props = {
  type: PlatformName
  name: string
}

const Platform = ({ type, name }: Props): JSX.Element => {
  const bgColor = useColorModeValue("gray.100", "gray.800")

  return (
    <Flex
      alignItems="center"
      mr={2}
      p={1}
      maxW="full"
      bgColor={bgColor}
      borderRadius="xl"
    >
      <Flex
        mr={2}
        boxSize={6}
        minW={6}
        minH={6}
        alignItems="center"
        justifyContent="center"
        bgColor={type === "TELEGRAM" ? "telegram.500" : "DISCORD.500"}
        color="white"
        rounded="lg"
        fontSize="medium"
      >
        <Icon as={type === "TELEGRAM" ? TelegramLogo : DiscordLogo} />
      </Flex>

      <Text
        as="span"
        isTruncated
        mr={2}
        fontFamily="display"
        fontWeight="bold"
        fontSize="xs"
        textTransform="uppercase"
        letterSpacing="wide"
      >
        {name}
      </Text>
    </Flex>
  )
}

export default Platform
