import { Divider, EASINGS, SimpleGrid } from "@chakra-ui/react"
import LinkButton from "components/common/LinkButton"
import { motion } from "framer-motion"
import { PlatformType } from "types"
import useGuild from "../hooks/useGuild"
import DiscordCard from "../RolePlatforms/components/PlatformCard/components/DiscordCard"
import TelegramCard from "../RolePlatforms/components/PlatformCard/components/TelegramCard"

const MotionSimpleGrid = motion(SimpleGrid)

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
    <MotionSimpleGrid
      columns={{ base: 1, md: 2 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.1, ease: EASINGS.easeIn },
      }}
    >
      {guildPlatforms?.map((platform) => {
        const PlatformComponent = PlatformComponents[platform.platformId]

        return (
          <PlatformComponent key={platform.id}>
            <Divider mt={3} mb={4} borderColor="gray" />
            <LinkButton
              href={platform.invite}
              colorScheme={PlatformType[platform.platformId]}
              h={10}
            >
              {platformTypeButtonLabel[PlatformType[platform.platformId]]}
            </LinkButton>
          </PlatformComponent>
        )
      })}
    </MotionSimpleGrid>
  )
}

export default AccessHub
