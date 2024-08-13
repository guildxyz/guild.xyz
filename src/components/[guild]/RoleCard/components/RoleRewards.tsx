import { SlideFade } from "@chakra-ui/react"
import AccessedGuildPlatformCard from "components/[guild]/AccessHub/components/AccessedGuildPlatformCard"
import {
  RolePlatformProvider,
  useRolePlatform,
} from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useGuild from "components/[guild]/hooks/useGuild"
import { ComponentProps, PropsWithChildren } from "react"
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
      {role.rolePlatforms?.map((rolePlatform, i) => {
        const guildPlatform = guildPlatforms?.find(
          (gp) => gp.id === rolePlatform.guildPlatformId
        )

        return (
          <SlideFade
            key={rolePlatform.guildPlatformId}
            offsetY={10}
            in={isOpen}
            transition={{ enter: { delay: i * 0.1 } }}
            /**
             * Spreading inert because it's not added to @types/react yet:
             * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60822
             */
            {...(!isOpen && ({ inert: "true" } as any))}
          >
            <RolePlatformProvider
              rolePlatform={{
                ...rolePlatform,
                guildPlatform,
              }}
            >
              <RewardWrapper>
                <AccessedGuildPlatformCard />
              </RewardWrapper>
            </RolePlatformProvider>
          </SlideFade>
        )
      })}

      {role.hiddenRewards && <HiddenRewards />}
    </div>
  )
}

const RewardWrapper = ({
  children,
}: PropsWithChildren<ComponentProps<typeof AccessedGuildPlatformCard>>) => {
  const { guildPlatform } = useRolePlatform()
  if (guildPlatform.platformId === PlatformType.ERC20)
    return (
      <TokenRewardProvider guildPlatform={guildPlatform}>
        {children}
      </TokenRewardProvider>
    )

  return children
}

export { RoleRewards }
