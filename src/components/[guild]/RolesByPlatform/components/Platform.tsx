import { Center, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useServerData from "hooks/useServerData"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import { useMemo } from "react"
import { Platform as GuildPlatformType, PlatformType } from "types"

type Props = {
  platform: GuildPlatformType
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

const Platform = ({
  platform: { id, platformId, platformGuildId },
}: Props): JSX.Element => {
  const bgColor = useColorModeValue("gray.100", "gray.800")

  const { roles } = useGuild()

  /**
   * TODO: Make a common hook for retrieving platform metadata (should work with
   * TELEGRAM, any everything else)
   */
  const { data } = useServerData(platformGuildId)

  const isGuarded = useMemo(
    () =>
      roles?.some((role) =>
        role?.rolePlatforms?.some(
          (rolePlatform) => rolePlatform?.platformRoleData?.isGuarded
        )
      ),
    [id, roles]
  )

  return (
    <Flex alignItems="center" p={1} bgColor={bgColor} borderRadius="xl">
      {/*
      // TODO: Do we want this here? If at least one role is guarded?
      isGuarded && (
        <Tooltip label="Guild guarded - protected from bots">
          <Center
            mr={1}
            boxSize={6}
            flexShrink={0}
            bgColor="green.500"
            color="white"
            rounded="lg"
            fontSize="medium"
          >
            <Icon as={Shield} />
          </Center>
        </Tooltip>
      )*/}

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
        {data?.serverName || "UNKNOWN"}
      </Text>
    </Flex>
  )
}

export default Platform
export { PlatformLogo }
