import { Icon } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { DiscordLogo } from "phosphor-react"
import { Requirement } from "types"
import pluralize from "utils/pluralize"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const dayInMs = 86400000

const DiscordJoinFromNowRequirementCard = ({ requirement }: Props): JSX.Element => {
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
    <RequirementCard
      image={<Icon as={DiscordLogo} boxSize={6} />}
      footer={
        <ConnectRequirementPlatformButton
          platform="DISCORD"
          roleId={requirement?.roleId}
        />
      }
    >
      {`Be a Discord user for `}
      <DataBlock>{formattedMemberSince}</DataBlock>
    </RequirementCard>
  )
}

export default DiscordJoinFromNowRequirementCard
