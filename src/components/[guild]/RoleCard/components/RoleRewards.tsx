import { SlideFade } from "@chakra-ui/react"
import AccessedGuildPlatformCard from "components/[guild]/AccessHub/components/AccessedGuildPlatformCard"
import useGuild from "components/[guild]/hooks/useGuild"
import { PlatformName, PlatformType, Role } from "types"
import HiddenRewards from "./HiddenRewards"

type Props = {
  role: Role
  isOpen: boolean
}

const TEMP_EXPLUDED_REWARDS: PlatformName[] = ["ERC20", "POINTS"]

const RoleRewards = ({ role, isOpen }: Props) => {
  const { guildPlatforms } = useGuild()

  return (
    <div className="mt-auto grid gap-2 p-5 sm:grid-cols-2">
      {role.rolePlatforms?.map((platform, i) => {
        const guildPlatform = guildPlatforms?.find(
          (gp) => gp.id === platform.guildPlatformId
        )

        {
          /* TODO: support all reward types */
        }
        if (
          !guildPlatform ||
          TEMP_EXPLUDED_REWARDS.includes(
            PlatformType[guildPlatform.platformId] as PlatformName
          )
        )
          return

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
            <AccessedGuildPlatformCard platform={guildPlatform} />
            {/* <Reward
            platform={platform}
            role={role}
            withLink
            withMotionImg
          /> */}
          </SlideFade>
        )
      })}

      {role.hiddenRewards && <HiddenRewards />}
    </div>
  )
}

export { RoleRewards }
