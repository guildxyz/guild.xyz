import { Img } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import DataBlockWithCopy from "components/common/DataBlockWithCopy"
import useResolveAddress from "hooks/useResolveAddress"
import shortenHex from "utils/shortenHex"
import EthereumAttestationRequirementFooter from "./components/EthereumAttestationRequirementFooter"

const EthereumAttestationRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const recipientDomain = useResolveAddress(requirement.data?.recipient)
  const attesterDomain = useResolveAddress(requirement.data?.attester)

  return (
    <Requirement
      image={
        <Img
          src={"/requirementLogos/eas.png"}
          maxWidth={"var(--chakra-space-8)"}
          maxHeight={"var(--chakra-space-8)"}
        />
      }
      footer={<EthereumAttestationRequirementFooter />}
      {...props}
    >
      {requirement.type === "EAS_ATTEST" ? (
        <>
          Attest{" "}
          <DataBlockWithCopy text={requirement.data?.recipient}>
            {recipientDomain ?? shortenHex(requirement.data?.recipient ?? "", 3)}
          </DataBlockWithCopy>{" "}
          according to schema{" "}
        </>
      ) : (
        <>
          Be attested by{" "}
          <DataBlockWithCopy text={requirement.data?.attester}>
            {attesterDomain ?? shortenHex(requirement.data?.attester ?? "", 3)}
          </DataBlockWithCopy>{" "}
          according to schema{" "}
        </>
      )}
      {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
      <DataBlockWithCopy text={requirement.data.schemaId}>
        {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
        {shortenHex(requirement.data.schemaId, 3)}
      </DataBlockWithCopy>
      {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
      {requirement.data.key && (
        <>
          {" with key "}
          {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
          <DataBlock>{requirement.data.key}</DataBlock>
          {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
          {requirement.data.val && (
            <>
              {" and value "}
              {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
              <DataBlock>{requirement.data.val}</DataBlock>
            </>
          )}
        </>
      )}{" "}
    </Requirement>
  )
}

export default EthereumAttestationRequirement
