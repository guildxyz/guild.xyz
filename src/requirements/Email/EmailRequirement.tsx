import { Icon } from "@chakra-ui/react"
import { EnvelopeSimple } from "@phosphor-icons/react"
import RequirementConnectButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"

const EmailRequirement = (props: RequirementProps) => {
  const { data, type } = useRequirementContext()

  return (
    <Requirement
      image={<Icon as={EnvelopeSimple} boxSize={6} />}
      footer={<RequirementConnectButton />}
      {...props}
    >
      {type === "EMAIL_VERIFIED" ? (
        "Have a verified email address"
      ) : (
        <>
          Have a verified email with domain <DataBlock>{data?.domain}</DataBlock>
        </>
      )}
    </Requirement>
  )
}

export default EmailRequirement
