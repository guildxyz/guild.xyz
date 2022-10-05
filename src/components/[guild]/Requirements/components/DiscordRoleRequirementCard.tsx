import { Icon } from "@chakra-ui/react"
import useServerData from "hooks/useServerData"
import { DiscordLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const DiscordRoleRequirementCard = ({ requirement }: Props) => {
  const {
    data: { serverName, roles, isAdmin, serverIcon },
  } = useServerData(requirement.data.serverId)

  const role =
    typeof isAdmin === "boolean"
      ? roles?.find(({ id }) => id === requirement.data.roleId)
      : undefined

  return (
    <RequirementCard
      requirement={requirement}
      image={serverIcon || <Icon as={DiscordLogo} boxSize={6} />}
      footer={<ConnectRequirementPlatformButton platform="DISCORD" />}
    >
      {`Have the "`}
      <pre>{role?.name || requirement.data.roleName}</pre>
      {`" role in the "`}
      <pre>{serverName || requirement.data.serverName}</pre>
      {`" server`}
    </RequirementCard>
  )
}

export default DiscordRoleRequirementCard
