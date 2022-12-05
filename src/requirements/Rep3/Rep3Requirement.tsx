import DataBlock from "components/common/DataBlock"
import { RequirementComponentProps } from "requirements"
import BlockExplorerUrl from "requirements/common/BlockExplorerUrl"
import Requirement from "requirements/common/Requirement"
import shortenHex from "utils/shortenHex"

const Rep3Requirement = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => (
  <Requirement
    image={"/requirementLogos/rep3.jpeg"}
    footer={<BlockExplorerUrl requirement={requirement} {...rest} />}
  >
    {`Have membership level of ${requirement.data.id} in `}
    {requirement.name ?? <DataBlock>{shortenHex(requirement.address, 3)}</DataBlock>}
  </Requirement>
)

export default Rep3Requirement
