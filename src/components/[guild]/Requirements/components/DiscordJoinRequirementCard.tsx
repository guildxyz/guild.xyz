import { Icon } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { DiscordLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const DiscordJoinRequirementCard = ({ requirement }: Props): JSX.Element => {
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
      {`Be a Discord user at least since `}
      <DataBlock>{formattedDate}</DataBlock>
    </RequirementCard>
  )
}

export default DiscordJoinRequirementCard
