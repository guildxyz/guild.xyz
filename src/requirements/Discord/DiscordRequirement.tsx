import { DiscordLogo } from "@phosphor-icons/react/dist/ssr"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import { DataBlockWithDate } from "components/[guild]/Requirements/components/DataBlockWithDate"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"
import useServerData from "hooks/useServerData"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

const DiscordRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  // TODO for later: I think we don't even need to call this hook here, serverName/roleName should be always set I think (see DiscordForm for more details)
  const { data: serverData } = useServerData(
    !requirement.data?.serverName ? requirement.data?.serverId : null
  )
  const { serverName, serverIcon, roles, isAdmin } = serverData ?? {}

  const displayedServerName =
    serverName || requirement.data?.serverName || requirement.data?.serverId

  const role =
    typeof isAdmin === "boolean"
      ? roles?.find(({ id }) => id === requirement.data?.roleId)
      : undefined
  const displayedRoleName =
    role?.name || requirement.data?.roleName || requirement.data?.roleId

  return (
    <Requirement
      image={serverIcon ?? <DiscordLogo weight="bold" className="size-6" />}
      footer={<ConnectRequirementPlatformButton />}
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "DISCORD_ROLE":
            return (
              <>
                <span>{`Have the `}</span>
                <DataBlock>{displayedRoleName}</DataBlock>
                <span>{` role in the `}</span>
                <DataBlock>{displayedServerName}</DataBlock>
                <span>{` server`}</span>
              </>
            )

          case "DISCORD_MEMBER_SINCE":
          case "DISCORD_JOIN":
            return requirement.type === "DISCORD_MEMBER_SINCE" ? (
              <>
                <span>{`Be member of the `}</span>
                <DataBlock>{displayedServerName}</DataBlock>
                {!!requirement.data?.memberSince && (
                  <>
                    <span>{` server since at least `}</span>
                    <DataBlockWithDate timestamp={requirement.data.memberSince} />
                  </>
                )}
              </>
            ) : (
              <>
                <span>{`Be a Discord user since at least `}</span>
                <DataBlockWithDate timestamp={requirement.data.memberSince} />
              </>
            )

          case "DISCORD_JOIN_FROM_NOW":
            const formattedMemberSince = formatRelativeTimeFromNow(
              requirement.data?.memberSince
            )

            return (
              <>
                <span>{`Have a Discord account older than `}</span>
                <DataBlock>{formattedMemberSince}</DataBlock>
              </>
            )
        }
      })()}
    </Requirement>
  )
}

export default DiscordRequirement
