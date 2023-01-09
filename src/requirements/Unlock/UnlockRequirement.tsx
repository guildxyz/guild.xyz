import { RequirementComponentProps } from "requirements"
import BlockExplorerUrl from "../common/BlockExplorerUrl"
import Requirement from "../common/Requirement"

const UnlockRequirement = ({ requirement, ...rest }: RequirementComponentProps) => (
  <Requirement
    isNegated={requirement.isNegated}
    image={`https://locksmith.unlock-protocol.com/lock/${requirement.address}/icon`}
    footer={<BlockExplorerUrl requirement={requirement} />}
    {...rest}
  >
    {`Own a(n) ${requirement.name ?? "-"} NFT`}
  </Requirement>
)

export default UnlockRequirement
