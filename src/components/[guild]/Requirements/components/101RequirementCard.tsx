import { Img } from "@chakra-ui/react"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const HundredNOneRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Img src="/requirementLogos/101.png" />}
  >
    {`Have a ${requirement.data.id} badge`}
  </RequirementCard>
)

export default HundredNOneRequirementCard
