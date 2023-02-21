import { Icon } from "@chakra-ui/react"
import Withdraw from "components/[guild]/CreatePoap/components/PoapRoleCard/components/Withdraw"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { RequirementProvider } from "components/[guild]/Requirements/components/RequirementContext"
import { SpeakerSimpleHigh } from "phosphor-react"
import { GuildPoap, RequirementType } from "types"
import usePoapEventDetails from "./hooks/usePoapEventDetails"

type Props = { guildPoap: GuildPoap } & RequirementProps

const PoapPaymentRequirement = ({ guildPoap, ...props }: Props) => {
  const { isAdmin } = useGuildPermission()
  const { poapEventDetails, isPoapEventDetailsLoading } = usePoapEventDetails()
  const { voiceRequirement, voiceChannelId } = poapEventDetails ?? {}

  const requirement = {
    id: null,
    type: "VOICE" as RequirementType,
    chain: null,
    address: null,
    data: voiceRequirement,
    roleId: null,
    name: null,
    symbol: null,
    isNegated: null,
  }

  return (
    <RequirementProvider requirement={requirement}>
      <Requirement
        image={<Icon as={SpeakerSimpleHigh} boxSize={6} />}
        footer={isAdmin && <Withdraw poapId={guildPoap?.id} />}
        {...props}
      >
        {`Be in the `}
        <DataBlock isLoading={isPoapEventDetailsLoading}>{voiceChannelId}</DataBlock>
        {` voice channel for at least ${
          voiceRequirement?.percent
            ? `${voiceRequirement?.percent}% of `
            : `${voiceRequirement?.minute} minutes during `
        } the event`}
      </Requirement>
    </RequirementProvider>
  )
}

export default PoapPaymentRequirement
