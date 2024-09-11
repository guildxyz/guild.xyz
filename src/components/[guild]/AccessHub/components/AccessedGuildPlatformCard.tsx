import PlatformCard from "components/[guild]/RolePlatforms/components/PlatformCard"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import { cardPropsHooks } from "rewards/cardPropsHooks"
import rewardComponentsConfig from "rewards/components"
import { PlatformName, PlatformType } from "types"
import PlatformAccessButton from "./PlatformAccessButton"

const AccessedGuildPlatformCard = () => {
  const { guildPlatform } = useRolePlatform()
  const { isDetailed } = useGuild()
  const { isAdmin } = useGuildPermission()

  const rewardComponents =
    rewardComponentsConfig[PlatformType[guildPlatform.platformId] as PlatformName]
  const useCardProps = cardPropsHooks[PlatformType[guildPlatform.platformId]]

  if (!rewardComponents || !useCardProps) return null

  const {
    cardMenuComponent: PlatformCardMenu,
    cardWarningComponent: PlatformCardWarning,
    cardButton: PlatformCardButton,
  } = rewardComponents

  return (
    <PlatformCard
      usePlatformCardProps={useCardProps}
      guildPlatform={guildPlatform}
      cornerButton={
        <>
          {PlatformCardWarning && <PlatformCardWarning />}
          {isAdmin && isDetailed && PlatformCardMenu && (
            <PlatformCardMenu platformGuildId={guildPlatform.platformGuildId} />
          )}
        </>
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
