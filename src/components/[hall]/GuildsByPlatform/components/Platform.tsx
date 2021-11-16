import { Button, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import { PlatformName } from "temporaryData/types"

type Props = {
  platformName: PlatformName
  platformId: string
}

const Platform = ({ platformName, platformId }: Props): JSX.Element => {
  const bgColor = useColorModeValue("gray.100", "gray.800")

  return (
    <Flex
      alignItems="center"
      mb={4}
      pr={1}
      width={{ base: "full", md: "max-content" }}
      maxWidth="full"
      bgColor={bgColor}
      borderRadius="xl"
    >
      <Flex
        mr={2}
        boxSize={8}
        minW={8}
        minH={8}
        alignItems="center"
        justifyContent="center"
        bgColor={platformName === "DISCORD" ? "DISCORD.500" : "telegram.500"}
        color="white"
        borderRadius="xl"
        fontSize="medium"
      >
        <Icon as={platformName === "DISCORD" ? DiscordLogo : TelegramLogo} />
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
      >{`${platformName} - ${platformId}`}</Text>

      <Button colorScheme="green" size="xs" ml="auto" rounded="lg">
        Join
      </Button>
    </Flex>
  )
}

export default Platform
