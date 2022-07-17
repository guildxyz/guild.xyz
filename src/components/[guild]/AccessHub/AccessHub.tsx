import { Divider, SimpleGrid } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import LinkButton from "components/common/LinkButton"
import { PlatformType } from "types"
import useGuild from "../hooks/useGuild"
import { PlatformName } from "../RolesByPlatform/components/JoinButton/platformsContent"
import PlatformDetails from "./components/PlatformDetails"

// TODO: duplicate code, we'll need to refactor this. (copied it from the PlatformCard component)
const platformBackgroundColor: Partial<Record<PlatformName, string>> = {
  DISCORD: "var(--chakra-colors-DISCORD-500)",
  TELEGRAM: "var(--chakra-colors-TELEGRAM-500)",
}

const platformTypeLabel = {
  DISCORD: "Discord",
  TELEGRAM: "Telegram",
}

const platformTypeButtonLabel = {
  DISCORD: "Visit server",
  TELEGRAM: "Visit group",
}

const AccessHub = (): JSX.Element => {
  const { guildPlatforms } = useGuild()

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }}>
      {guildPlatforms?.map((platform) => (
        <ColorCard
          key={platform.platformId}
          color={platformBackgroundColor[PlatformType[platform.platformId]]}
          pt={{ base: 10, sm: 11 }}
        >
          <PlatformDetails platform={platform} />
          <Divider mt={3} mb={4} borderColor="gray" />
          <LinkButton
            href={platform.invite}
            colorScheme={PlatformType[platform.platformId]}
            h={10}
          >
            {platformTypeButtonLabel[PlatformType[platform.platformId]]}
          </LinkButton>
          <ColorCardLabel
            fallbackColor="white"
            type={PlatformType[platform.platformId]}
            typeBackgroundColors={platformBackgroundColor}
            typeLabel={platformTypeLabel}
            top="-px"
            left="-px"
            borderBottomRightRadius="xl"
            borderTopLeftRadius="xl"
          />
        </ColorCard>
      ))}
    </SimpleGrid>
  )
}

export default AccessHub
