import { Img } from "@chakra-ui/react"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const DiscoRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Img src="/requirementLogos/disco.png" />}
    footer={<p>WIP</p>}
  >
    {/* {(requirement.data.params as DiscoParamType).} */}
  </RequirementCard>
)

export default DiscoRequirementCard
