import { Center, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import { Platform as GuildPlatformType, PlatformType } from "types"

type Props = {
  platform: GuildPlatformType
  name: string
}

const PlatformLogo = ({ type, ...rest }) => (
  <Center
    mr={2}
    boxSize={6}
    flexShrink={0}
    bgColor={type === PlatformType.DISCORD ? "DISCORD.500" : "telegram.500"}
    color="white"
    rounded="lg"
    fontSize="medium"
    {...rest}
  >
    <Icon as={type === PlatformType.DISCORD ? DiscordLogo : TelegramLogo} />
  </Center>
)

const Platform = ({ platform: { platformId }, name }: Props): JSX.Element => {
  const bgColor = useColorModeValue("gray.100", "gray.800")

  return (
    <Flex alignItems="center" p={1} bgColor={bgColor} borderRadius="xl">
      <PlatformLogo type={platformId} />

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
        {name || "UNKNOWN"}
      </Text>
    </Flex>
  )
}

export default Platform
export { PlatformLogo }
