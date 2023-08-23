import { HStack, Img } from "@chakra-ui/react"
import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { RequirementLinkButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useResolveAddress from "hooks/resolving/useResolveAddress"
import shortenHex from "utils/shortenHex"

const EAS_SCAN_BASE = "https://easscan.org/schema/view"

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
      footer={
        <HStack spacing={4}>
          <RequirementLinkButton
            href={`${EAS_SCAN_BASE}/${requirement?.data?.schemaId}`}
            imageUrl="/requirementLogos/eas.png"
          >
            {/* View schema on EAS scan */}
            Schema
          </RequirementLinkButton>
          <BlockExplorerUrl
            address={requirement.data?.attester ?? requirement.data?.recipient}
            // label={`View ${
            //   requirement.type === "EAS_ATTEST" ? "recipient" : "attester"
            // } on explorer`}
            label={requirement.type === "EAS_ATTEST" ? "Recipient" : "Attester"}
          />
        </HStack>
      }
      {...props}
    >
      {requirement.type === "EAS_ATTEST" ? (
        <>
          Attest{" "}
          <DataBlock>
            {recipientDomain ?? shortenHex(requirement.data?.recipient ?? "", 3)}
          </DataBlock>{" "}
          according to schema{" "}
        </>
      ) : (
        <>
          Be attested by{" "}
          <DataBlock>
            {attesterDomain ?? shortenHex(requirement.data?.attester ?? "", 3)}
          </DataBlock>{" "}
          according to schema{" "}
        </>
      )}
      <DataBlock>{shortenHex(requirement.data.schemaId, 3)}</DataBlock>
      {requirement.data.key && (
        <>
          {" with key "}
          <DataBlock>{requirement.data.key}</DataBlock>
          {requirement.data.val && (
            <>
              {" and value "}
              <DataBlock>{requirement.data.val}</DataBlock>
            </>
          )}
        </>
      )}
    </Requirement>
  )
}

export default EthereumAttestationRequirement
