import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import { PlatformName } from "temporaryData/types"

// TODO: this type name is pretty strange... ?
type Props = {
  platformType: PlatformName
  platformName: string
}

const Platform = ({ platformType, platformName }: Props): JSX.Element => {
  const bgColor = useColorModeValue("white", "gray.800")

  return (
    <Flex
      // TODO: find a better solution maybe?...
      maxW={{ base: "75%", sm: "full" }}
      alignItems="center"
      p={1}
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
        bgColor={platformType === "TELEGRAM" ? "telegram.500" : "DISCORD.500"}
        color="white"
        rounded="lg"
        fontSize="medium"
      >
        <Icon as={platformType === "TELEGRAM" ? TelegramLogo : DiscordLogo} />
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
        {platformName}
      </Text>
    </Flex>
  )
}

export default Platform
