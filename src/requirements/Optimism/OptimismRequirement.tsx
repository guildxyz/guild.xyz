import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import Requirement from "requirements/common/Requirement"
import shortenHex from "utils/shortenHex"

const OptimismRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => (
  <Requirement
    isNegated={requirement.isNegated}
    image="/networkLogos/optimism.svg"
    {...rest}
  >
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

export default OptimismRequirement
