import { Icon } from "@chakra-ui/react"
import { DiscordLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const DiscordRoleRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Icon as={DiscordLogo} boxSize={6} />}
    footer={<ConnectRequirementPlatformButton platform="DISCORD" />}
  >
    {`Have the "${requirement.data.roleName}" role in the "${requirement.data.serverName}" server`}
  </RequirementCard>
)

export default DiscordRoleRequirementCard
