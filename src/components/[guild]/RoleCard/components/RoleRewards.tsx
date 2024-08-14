import { SlideFade } from "@chakra-ui/react"
import AccessedGuildPlatformCard from "components/[guild]/AccessHub/components/AccessedGuildPlatformCard"
import { RolePlatformProvider } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import dynamic from "next/dynamic"
import { PropsWithChildren } from "react"
import { Role } from "types"
import HiddenRewards from "./HiddenRewards"

type Props = {
  role: Role
  isOpen: boolean
}

const DynamicApiRequirementHandlerProvider = dynamic(() =>
  import("components/[guild]/RequirementHandlerContext").then(
    (module) => module.ApiRequirementHandlerProvider
  )
)

const RoleRewards = ({ role, isOpen }: Props) => {
  const { guildPlatforms } = useGuild()

  return (
    <DynamicRewardsWrapper roleId={role.id}>
      <div className="mt-auto grid grid-cols-1 gap-3 p-5 xl:grid-cols-2">
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
                <AccessedGuildPlatformCard />
              </RolePlatformProvider>
            </SlideFade>
          )
        })}

        {role.hiddenRewards && <HiddenRewards />}
      </div>
    </DynamicRewardsWrapper>
  )
}

const DynamicRewardsWrapper = ({
  roleId,
  children,
}: PropsWithChildren<{ roleId: number }>) => {
  const { isAdmin } = useGuildPermission()

  if (isAdmin)
    return (
      <DynamicApiRequirementHandlerProvider roleId={roleId}>
        {children}
      </DynamicApiRequirementHandlerProvider>
    )

  return children
}

export { RoleRewards }
