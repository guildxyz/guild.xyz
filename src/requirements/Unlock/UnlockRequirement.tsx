import { RequirementComponentProps } from "requirements"
import BlockExplorerUrl from "../common/BlockExplorerUrl"
import Requirement from "../common/Requirement"

const UnlockRequirement = ({ requirement, ...rest }: RequirementComponentProps) => (
  <Requirement
    image={`https://locksmith.unlock-protocol.com/lock/${requirement.address}/icon`}
    footer={<BlockExplorerUrl requirement={requirement} />}
    {...rest}
  >
    {`Own a(n) ${requirement.name ?? "- (Unlock)"} NFT`}
  </Requirement>
)

export default UnlockRequirement
