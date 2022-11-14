import { Icon } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import useServerData from "hooks/useServerData"
import { DiscordLogo } from "phosphor-react"
import { RequirementComponentProps } from "types"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import Requirement from "./common/Requirement"

const DiscordRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const {
    data: { serverName, roles, isAdmin, serverIcon },
  } = useServerData(requirement.data.serverId)

  const role =
    typeof isAdmin === "boolean"
      ? roles?.find(({ id }) => id === requirement.data.roleId)
      : undefined

  return (
    <Requirement
      image={serverIcon || <Icon as={DiscordLogo} boxSize={6} />}
      footer={
        <ConnectRequirementPlatformButton
          platform="DISCORD"
          roleId={requirement?.roleId}
        />
      }
      {...rest}
    >
      {`Have the "`}
      <DataBlock>{role?.name || requirement.data.roleName}</DataBlock>
      {`" role in the "`}
      <DataBlock>{serverName || requirement.data.serverName}</DataBlock>
      {`" server`}
    </Requirement>
  )
}

export default DiscordRequirement
