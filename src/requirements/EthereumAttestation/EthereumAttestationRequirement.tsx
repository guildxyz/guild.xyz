import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"
import { DataBlockWithCopy } from "components/common/DataBlockWithCopy"
import useResolveAddress from "hooks/useResolveAddress"
import shortenHex from "utils/shortenHex"
import { EthereumAttestationRequirementFooter } from "./components/EthereumAttestationRequirementFooter"

const EthereumAttestationRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const recipientDomain = useResolveAddress(requirement.data?.recipient)
  const attesterDomain = useResolveAddress(requirement.data?.attester)

  return (
    <Requirement
      image={<img src={"/requirementLogos/eas.png"} className="max-h-8 max-w-8" />}
      footer={<EthereumAttestationRequirementFooter />}
      {...props}
    >
      {requirement.type === "EAS_ATTEST" ? (
        <>
          <span>{"Attest "}</span>
          <DataBlockWithCopy text={requirement.data?.recipient}>
            {recipientDomain ?? shortenHex(requirement.data?.recipient ?? "", 3)}
          </DataBlockWithCopy>
          <span>{" according to schema "}</span>
        </>
      ) : (
        <>
          <span>{"Be attested by "}</span>
          <DataBlockWithCopy text={requirement.data?.attester}>
            {attesterDomain ?? shortenHex(requirement.data?.attester ?? "", 3)}
          </DataBlockWithCopy>
          <span>{" according to schema "}</span>
        </>
      )}
      <DataBlockWithCopy text={requirement.data.schemaId}>
        {shortenHex(requirement.data.schemaId, 3)}
      </DataBlockWithCopy>
      {requirement.data.key && (
        <>
          <span>{" with key "}</span>
          <DataBlock>{requirement.data.key}</DataBlock>
          {requirement.data.val && (
            <>
              <span>{" and value "}</span>
              <DataBlock>{requirement.data.val}</DataBlock>
            </>
          )}
        </>
      )}
    </Requirement>
  )
}

export default EthereumAttestationRequirement
