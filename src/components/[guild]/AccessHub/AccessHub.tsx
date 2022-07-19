import { SimpleGrid } from "@chakra-ui/react"
import LinkButton from "components/common/LinkButton"
import { PlatformType } from "types"
import useGuild from "../hooks/useGuild"
import DiscordCard from "../RolePlatforms/components/PlatformCard/components/DiscordCard"
import TelegramCard from "../RolePlatforms/components/PlatformCard/components/TelegramCard"

const PlatformComponents = {
  DISCORD: DiscordCard,
  TELEGRAM: TelegramCard,
}

const platformTypeButtonLabel = {
  DISCORD: "Visit server",
  TELEGRAM: "Visit group",
}

const AccessHub = (): JSX.Element => {
  const { guildPlatforms } = useGuild()

  return (
    <SimpleGrid
      templateColumns={{
        base: "repeat(auto-fit, minmax(250px, 1fr))",
        md: "repeat(auto-fit, minmax(250px, .5fr))",
      }}
      gap={4}
      mb="10"
    >
      {guildPlatforms?.map((platform) => {
        const PlatformComponent =
          PlatformComponents[PlatformType[platform.platformId]]

        return (
          <PlatformComponent key={platform.id} guildPlatform={platform} colSpan={1}>
            <LinkButton
              mt="6"
              href={platform.invite}
              colorScheme={PlatformType[platform.platformId]}
              h={10}
            >
              {platformTypeButtonLabel[PlatformType[platform.platformId]]}
            </LinkButton>
          </PlatformComponent>
        )
      })}
    </SimpleGrid>
  )
}

export default AccessHub
