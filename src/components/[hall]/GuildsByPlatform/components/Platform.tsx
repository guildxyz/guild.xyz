import { Flex, HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import { PlatformName } from "temporaryData/types"

type Props = {
  platformName: PlatformName
  platformId: string
}

const Platform = ({ platformName, platformId }: Props): JSX.Element => {
  const bgColor = useColorModeValue("gray.100", "gray.800")

  return (
    <HStack
      wrap="wrap"
      spacing={0}
      mb={4}
      pr={2}
      width="max-content"
      bgColor={bgColor}
      borderRadius="xl"
      fontWeight="bold"
      fontSize={{ base: "xs", sm: "sm" }}
      textTransform="uppercase"
      letterSpacing="wide"
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

      <Text as="span">{`${platformName} - ${platformId}`}</Text>
    </HStack>
  )
}

export default Platform
