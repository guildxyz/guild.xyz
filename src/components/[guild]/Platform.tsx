import { Flex, HStack, Icon, Text } from "@chakra-ui/react"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import { Platform as PlatformType } from "temporaryData/types"

type Props = {
  platform: PlatformType
}

const Platform = ({ platform }: Props): JSX.Element => {
  return (
    <HStack
      wrap="wrap"
      spacing={0}
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
        bgColor={platform.name === "DISCORD" ? "DISCORD.500" : "telegram.500"}
        borderRadius="xl"
        fontSize="medium"
      >
        <Icon as={platform.name === "DISCORD" ? DiscordLogo : TelegramLogo} />
      </Flex>

      {platform.name === "DISCORD" ? (
        <>
          <Text as="span" color="gray.400">
            Discord ({platform.platformId})
          </Text>
          <Text as="span" color="gray.600" px={1}>
            /
          </Text>
          <Text as="span" color="gray.400">
            #general ({platform.inviteChannel})
          </Text>
        </>
      ) : (
        <Text as="span" color="gray.400">
          Telegram ({platform.platformId})
        </Text>
      )}
    </HStack>
  )
}

export default Platform
