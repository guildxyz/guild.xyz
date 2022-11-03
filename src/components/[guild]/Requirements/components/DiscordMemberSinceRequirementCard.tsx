import { Icon } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import useServerData from "hooks/useServerData"
import { DiscordLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const DiscordMemberSinceRequirementCard = ({ requirement }: Props): JSX.Element => {
  const {
    data: { serverName },
  } = useServerData(requirement.data.serverId)
  const formattedDate = new Date(requirement.data.memberSince).toLocaleDateString()

  return (
    <RequirementCard
      requirement={requirement}
      image={<Icon as={DiscordLogo} boxSize={6} />}
      footer={
        <ConnectRequirementPlatformButton
          platform="DISCORD"
          roleId={requirement?.roleId}
        />
      }
    >
      {`Be a member of the `}
      <DataBlock>{serverName || requirement.data.serverName}</DataBlock>
      {` server at least since `}
      <DataBlock>{formattedDate}</DataBlock>
    </RequirementCard>
  )
}

export default DiscordMemberSinceRequirementCard
