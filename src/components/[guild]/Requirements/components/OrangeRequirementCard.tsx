import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const OrangeRequirementCard = ({ requirement }: Props) => (
  <RequirementCard requirement={requirement} image={<p>WIP</p>} footer={<p>WIP</p>}>
    WIP
  </RequirementCard>
)

export default OrangeRequirementCard
