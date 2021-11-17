import {
  Button,
  Divider,
  HStack,
  useBreakpointValue,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { Guild, PlatformName } from "temporaryData/types"
import GuildListItem from "./components/GuildListItem"
import Platform from "./components/Platform"

type Props = {
  platformName: PlatformName
  platformId: string
  guilds: Array<Guild>
}

const GuildsByPlatform = ({ guilds }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const buttonSize = useBreakpointValue({ base: "sm", sm: "md" })
  const { name: platformType, serverName: platformName } =
    guilds[0]?.guildPlatforms?.[0]

  return (
    <Card width="full">
      <HStack
        px={{ base: 4, sm: 6 }}
        py={{ base: 2, sm: 4 }}
        alignItems="center"
        justifyContent="space-between"
        bgColor={colorMode === "light" ? "gray.100" : "blackAlpha.300"}
      >
        <Platform platformType={platformType} platformName={platformName} />
        <Button
          size={buttonSize}
          colorScheme="green"
          ml="auto"
          maxH={10}
          rounded="xl"
        >
          Join
        </Button>
      </HStack>

      <VStack px={{ base: 5, sm: 6 }} py={4} divider={<Divider />}>
        {guilds?.map((guild) => (
          <GuildListItem key={guild.id} guildData={guild} />
        ))}
      </VStack>
    </Card>
  )
}

export default GuildsByPlatform
