import DataBlock from "components/common/DataBlock"
import { RequirementComponentProps } from "requirements"
import Requirement from "requirements/common/Requirement"
import shortenHex from "utils/shortenHex"

const OptimismRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => (
  <Requirement image={"networkLogos/optimism.svg"} {...rest}>
    {requirement.type === "OPTIMISM_ATTESTATION" ? (
      <>
        {"Have "}
        {requirement.data.val ? (
          <>
            {"the "}
            <DataBlock>{requirement.data.val}</DataBlock>
          </>
        ) : (
          "an"
        )}
        {" attestation from "}
        <DataBlock>{shortenHex(requirement.data.creator, 3)}</DataBlock>
        {" in the "}
        <DataBlock>{requirement.data.key}</DataBlock>
        {" theme"}
      </>
    ) : (
      "Have an Optimism profile pic"
    )}
  </Requirement>
)

export default OptimismRequirement
