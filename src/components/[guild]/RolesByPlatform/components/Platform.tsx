import {
  Center,
  Flex,
  Icon,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { DiscordLogo, Shield, TelegramLogo } from "phosphor-react"
import { useMemo } from "react"
import { PlatformName } from "types"

type Props = {
  id: number
  type: PlatformName
  name: string
}

const PlatformLogo = ({ type, ...rest }) => (
  <Center
    mr={2}
    boxSize={6}
    flexShrink={0}
    bgColor={type === "TELEGRAM" ? "telegram.500" : "DISCORD.500"}
    color="white"
    rounded="lg"
    fontSize="medium"
    {...rest}
  >
    <Icon as={type === "TELEGRAM" ? TelegramLogo : DiscordLogo} />
  </Center>
)

const Platform = ({ id, type, name }: Props): JSX.Element => {
  const bgColor = useColorModeValue("gray.100", "gray.800")

  const { platforms } = useGuild()

  const isGuarded = useMemo(
    () => platforms?.find((p) => p.id === id)?.isGuarded,
    [id, platforms]
  )

  return (
    <Flex alignItems="center" p={1} bgColor={bgColor} borderRadius="xl">
      {isGuarded && (
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
      )}

      <PlatformLogo type={type} />

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
export { PlatformLogo }
