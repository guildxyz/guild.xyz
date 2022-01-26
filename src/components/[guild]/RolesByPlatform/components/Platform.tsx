import { Center, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react"
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
      p={1}
      bgColor={bgColor}
      borderRadius="xl"
      overflow={"hidden"}
    >
      <Center
        mr={2}
        boxSize={6}
        flexShrink={0}
        bgColor={type === "TELEGRAM" ? "telegram.500" : "DISCORD.500"}
        color="white"
        rounded="lg"
        fontSize="medium"
      >
        <Icon as={type === "TELEGRAM" ? TelegramLogo : DiscordLogo} />
      </Center>

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
