import { Icon } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useServerData from "hooks/useServerData"
import { DiscordLogo } from "phosphor-react"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

const DiscordRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { guildPlatforms } = useGuild()
  const {
    data: { serverName, serverIcon, roles, isAdmin },
  } = useServerData(requirement.data.serverId)

  const renderedServerIcon = guildPlatforms?.find(
    (p) => p.platformGuildId === requirement.data.serverId
  )
    ? null
    : serverIcon || null

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={renderedServerIcon ?? <Icon as={DiscordLogo} boxSize={6} />}
      footer={<ConnectRequirementPlatformButton />}
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "DISCORD_ROLE":
            const role =
              typeof isAdmin === "boolean"
                ? roles?.find(({ id }) => id === requirement.data.roleId)
                : undefined

            return (
              <>
                {`Have the `}
                <DataBlock>{role?.name || requirement.data.roleName}</DataBlock>
                {` role in the `}
                <DataBlock>{serverName || requirement.data.serverName}</DataBlock>
                {` server`}
              </>
            )

          case "DISCORD_MEMBER_SINCE":
          case "DISCORD_JOIN":
            const formattedDate = new Date(
              requirement.data.memberSince
            ).toLocaleDateString()

            return requirement.type === "DISCORD_MEMBER_SINCE" ? (
              <>
                {`Be member of the `}
                <DataBlock>{serverName || requirement.data.serverName}</DataBlock>
                {` server since at least `}
                <DataBlock>{formattedDate}</DataBlock>
              </>
            ) : (
              <>
                {`Be a Discord user since at least `}
                <DataBlock>{formattedDate}</DataBlock>
              </>
            )

          case "DISCORD_JOIN_FROM_NOW":
            const formattedMemberSince = formatRelativeTimeFromNow(
              requirement.data.memberSince
            )

            return (
              <>
                {`Have a Discord account older than `}
                <DataBlock>{formattedMemberSince}</DataBlock>
              </>
            )
        }
      })()}
    </Requirement>
  )
}

export default DiscordRequirement
