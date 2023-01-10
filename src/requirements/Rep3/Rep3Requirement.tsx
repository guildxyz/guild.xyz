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
    image={"/requirementLogos/rep3.png"}
    footer={<BlockExplorerUrl requirement={requirement} />}
    {...rest}
  >
    {`Have a level ${requirement.data.id} rep3 membership NFT in DAO: `}
    <DataBlock>{requirement.name ?? shortenHex(requirement.address, 3)}</DataBlock>
  </Requirement>
)

export default Rep3Requirement
