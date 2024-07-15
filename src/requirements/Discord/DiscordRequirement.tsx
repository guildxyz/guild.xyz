import { Icon, Text } from "@chakra-ui/react"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import DataBlockWithDate from "components/[guild]/Requirements/components/DataBlockWithDate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import useServerData from "hooks/useServerData"
import { PiDiscordLogo } from "react-icons/pi"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

const DiscordRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  // TODO for later: I think we don't even need to call this hook here, serverName/roleName should be always set I think (see DiscordForm for more details)
  const {
    data: { serverName, serverIcon, roles, isAdmin },
  } = useServerData(
    !requirement.data?.serverName ? requirement.data?.serverId : null
  )

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
      image={serverIcon ?? <Icon as={PiDiscordLogo} boxSize={6} />}
      footer={<ConnectRequirementPlatformButton />}
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "DISCORD_ROLE":
            return (
              <>
                <Text as="span">{`Have the `}</Text>
                <DataBlock>{displayedRoleName}</DataBlock>
                <Text as="span">{` role in the `}</Text>
                <DataBlock>{displayedServerName}</DataBlock>
                <Text as="span">{` server`}</Text>
              </>
            )

          case "DISCORD_MEMBER_SINCE":
          case "DISCORD_JOIN":
            return requirement.type === "DISCORD_MEMBER_SINCE" ? (
              <>
                <Text as="span">{`Be member of the `}</Text>
                <DataBlock>{displayedServerName}</DataBlock>
                <Text as="span">{` server since at least `}</Text>
                <DataBlockWithDate timestamp={requirement.data?.memberSince} />
              </>
            ) : (
              <>
                <Text as="span">{`Be a Discord user since at least `}</Text>
                <DataBlockWithDate timestamp={requirement.data?.memberSince} />
              </>
            )

          case "DISCORD_JOIN_FROM_NOW":
            const formattedMemberSince = formatRelativeTimeFromNow(
              requirement.data?.memberSince
            )

            return (
              <>
                <Text as="span">{`Have a Discord account older than `}</Text>
                <DataBlock>{formattedMemberSince}</DataBlock>
              </>
            )
        }
      })()}
    </Requirement>
  )
}

export default DiscordRequirement
