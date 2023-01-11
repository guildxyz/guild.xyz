import { Icon } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import useGuild from "components/[guild]/hooks/useGuild"
import useServerData from "hooks/useServerData"
import { DiscordLogo } from "phosphor-react"
import { RequirementComponentProps } from "requirements"
import pluralize from "utils/pluralize"
import ConnectRequirementPlatformButton from "../common/ConnectRequirementPlatformButton"
import Requirement from "../common/Requirement"

const DiscordRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
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
      image={renderedServerIcon ?? <Icon as={DiscordLogo} boxSize={6} />}
      footer={<ConnectRequirementPlatformButton requirement={requirement} />}
      {...rest}
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
                {`" server`}
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
            const dayInMs = 86400000
            const memberSinceDays = requirement.data.memberSince / dayInMs
            const memberSinceMonths = requirement.data.memberSince / dayInMs / 30
            const memberSinceYears = requirement.data.memberSince / dayInMs / 365
            const formattedMemberSince =
              memberSinceYears >= 1
                ? pluralize(Math.round(memberSinceYears), "year")
                : memberSinceMonths >= 1
                ? pluralize(Math.round(memberSinceMonths), "month")
                : pluralize(Math.round(memberSinceDays), "day")

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
