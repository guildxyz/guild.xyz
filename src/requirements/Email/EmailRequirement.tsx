import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr"
import RequirementConnectButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"

const EmailRequirement = (props: RequirementProps) => {
  const { data, type } = useRequirementContext()

  return (
    <Requirement
      image={<EnvelopeSimple weight="bold" className="size-6" />}
      footer={<RequirementConnectButton />}
      {...props}
    >
      {type === "EMAIL_VERIFIED" ? (
        "Have a verified email address"
      ) : (
        <>
          <span>{"Have a verified email with domain "}</span>
          <DataBlock>{data?.domain}</DataBlock>
        </>
      )}
    </Requirement>
  )
}

export default EmailRequirement
