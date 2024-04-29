import PlatformCard from "components/[guild]/RolePlatforms/components/PlatformCard"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import rewards from "platforms/rewards"
import { GuildPlatform, PlatformName, PlatformType } from "types"
import PlatformAccessButton from "./PlatformAccessButton"

const AccessedGuildPlatformCard = ({ platform }: { platform: GuildPlatform }) => {
  const { isDetailed } = useGuild()
  const { isAdmin } = useGuildPermission()

  if (!rewards[PlatformType[platform.platformId]]) return null

  const {
    cardPropsHook: useCardProps,
    cardMenuComponent: PlatformCardMenu,
    cardWarningComponent: PlatformCardWarning,
    cardButton: PlatformCardButton,
  } = rewards[PlatformType[platform.platformId] as PlatformName]

  return (
    <PlatformCard
      usePlatformCardProps={useCardProps}
      guildPlatform={platform}
      cornerButton={
        isAdmin && isDetailed && PlatformCardMenu ? (
          <PlatformCardMenu platformGuildId={platform.platformGuildId} />
        ) : PlatformCardWarning ? (
          <PlatformCardWarning guildPlatform={platform} />
        ) : null
      }
    >
      {PlatformCardButton ? (
        <PlatformCardButton platform={platform} />
      ) : (
        <PlatformAccessButton platform={platform} />
      )}
    </PlatformCard>
  )
}
export default AccessedGuildPlatformCard
