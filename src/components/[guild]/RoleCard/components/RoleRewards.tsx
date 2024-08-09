import { SlideFade } from "@chakra-ui/react"
import AccessedGuildPlatformCard from "components/[guild]/AccessHub/components/AccessedGuildPlatformCard"
import useGuild from "components/[guild]/hooks/useGuild"
import { ComponentProps, PropsWithChildren } from "react"
import PointsRewardCard from "rewards/Points/PointsRewardCard"
import { TokenRewardProvider } from "rewards/Token/TokenRewardContext"
import { PlatformType, Role } from "types"
import HiddenRewards from "./HiddenRewards"

type Props = {
  role: Role
  isOpen: boolean
}

const RoleRewards = ({ role, isOpen }: Props) => {
  const { guildPlatforms } = useGuild()

  return (
    <div className="mt-auto grid gap-3 p-5 xl:grid-cols-2">
      {role.rolePlatforms?.map((platform, i) => {
        const guildPlatform = guildPlatforms?.find(
          (gp) => gp.id === platform.guildPlatformId
        )

        {
          /* TODO: support all reward types (points, erc20) */
        }
        if (!guildPlatform) return

        return (
          <SlideFade
            key={platform.guildPlatformId}
            offsetY={10}
            in={isOpen}
            transition={{ enter: { delay: i * 0.1 } }}
            /**
             * Spreading inert because it's not added to @types/react yet:
             * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60822
             */
            {...(!isOpen && ({ inert: "true" } as any))}
          >
            {guildPlatform.platformId === PlatformType.POINTS ? (
              <PointsRewardCard guildPlatform={guildPlatform} />
            ) : (
              <RewardWrapper platform={guildPlatform}>
                <AccessedGuildPlatformCard platform={guildPlatform} />
              </RewardWrapper>
            )}
          </SlideFade>
        )
      })}

      {role.hiddenRewards && <HiddenRewards />}
    </div>
  )
}

const RewardWrapper = ({
  platform,
  children,
}: PropsWithChildren<ComponentProps<typeof AccessedGuildPlatformCard>>) => {
  if (platform.platformId === PlatformType.ERC20)
    return (
      <TokenRewardProvider guildPlatform={platform}>{children}</TokenRewardProvider>
    )

  return children
}

export { RoleRewards }
