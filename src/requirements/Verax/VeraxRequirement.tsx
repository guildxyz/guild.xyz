import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"
import { DataBlockWithCopy } from "components/common/DataBlockWithCopy"
import shortenHex from "utils/shortenHex"
import { VeraxRequirementFooter } from "./VeraxRequirementFooter"

const VeraxRequirement = (props: RequirementProps): JSX.Element => {
  const { type, data } = useRequirementContext<
    "VERAX_ATTEST" | "VERAX_ATTESTED_BY"
  >()
  return (
    <Requirement
      image="/requirementLogos/verax.png"
      footer={<VeraxRequirementFooter />}
      {...props}
    >
      {type === "VERAX_ATTEST" ? (
        <>
          <span>{"Attest "}</span>
          <DataBlockWithCopy text={data.subject}>
            {shortenHex(data.subject ?? "", 3)}
          </DataBlockWithCopy>
          <span>{" according to schema "}</span>
        </>
      ) : (
        <>
          <span>{"Be attested by "}</span>
          <DataBlockWithCopy text={data.attester}>
            {shortenHex(data.attester ?? "", 3)}
          </DataBlockWithCopy>
          <span>{" according to schema "}</span>
        </>
      )}
      <DataBlockWithCopy text={data.schemaId}>
        {shortenHex(data.schemaId, 3)}
      </DataBlockWithCopy>
      {data.key && (
        <>
          <span>{" with key "}</span>
          <DataBlock>{data.key}</DataBlock>
          {data.val && (
            <>
              <span>{" and value "}</span>
              <DataBlock>{data.val}</DataBlock>
            </>
          )}
        </>
      )}
    </Requirement>
  )
}

export default VeraxRequirement
