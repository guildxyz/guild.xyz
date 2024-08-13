import PlatformCard from "components/[guild]/RolePlatforms/components/PlatformCard"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import rewards from "rewards"
import { cardPropsHooks } from "rewards/cardPropsHooks"
import rewardComponents from "rewards/components"
import { PlatformName, PlatformType } from "types"
import PlatformAccessButton from "./PlatformAccessButton"

const AccessedGuildPlatformCard = () => {
  const { guildPlatform } = useRolePlatform()
  const { isDetailed } = useGuild()
  const { isAdmin } = useGuildPermission()

  if (!rewards[PlatformType[guildPlatform.platformId]]) return null

  const {
    cardMenuComponent: PlatformCardMenu,
    cardWarningComponent: PlatformCardWarning,
    cardButton: PlatformCardButton,
  } = rewardComponents[PlatformType[guildPlatform.platformId] as PlatformName]
  const useCardProps = cardPropsHooks[PlatformType[guildPlatform.platformId]]

  return (
    <PlatformCard
      usePlatformCardProps={useCardProps}
      guildPlatform={guildPlatform}
      cornerButton={
        isAdmin && isDetailed && PlatformCardMenu ? (
          <PlatformCardMenu platformGuildId={guildPlatform.platformGuildId} />
        ) : PlatformCardWarning ? (
          <PlatformCardWarning guildPlatform={guildPlatform} />
        ) : null
      }
      h="full"
      p={{ base: 3, sm: 4 }}
      boxShadow="none"
    >
      {PlatformCardButton ? (
        <PlatformCardButton platform={guildPlatform} />
      ) : (
        <PlatformAccessButton platform={guildPlatform} />
      )}
    </PlatformCard>
  )
}
export default AccessedGuildPlatformCard
