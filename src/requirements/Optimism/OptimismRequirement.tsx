import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import shortenHex from "utils/shortenHex"

const OptimismRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
    <Requirement image="/networkLogos/optimism.svg" {...props}>
      {requirement.type === "OPTIMISM_ATTESTATION" ? (
        <>
          {"Have an attestation from "}
          <DataBlock>{shortenHex(requirement.data.creator, 3)}</DataBlock>
          {" with key "}
          <DataBlock>{requirement.data.key}</DataBlock>
          {requirement.data.val && (
            <>
              {" and value "}
              <DataBlock>{requirement.data.val}</DataBlock>
            </>
          )}
        </>
      ) : (
        "Have an Optimist PFP"
      )}
    </Requirement>
  )
}

export default OptimismRequirement
