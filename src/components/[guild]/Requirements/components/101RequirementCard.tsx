import { Img } from "@chakra-ui/react"
import { Requirement } from "types"
import { RequirementLinkButton } from "./common/RequirementButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const HundredNOneRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Img src="/requirementLogos/101.png" />}
    footer={
      <RequirementLinkButton
        imageUrl={"/requirementLogos/101.png"}
        href={`https://101.xyz/course/${requirement.data.id}`}
      >
        View badge
      </RequirementLinkButton>
    }
  >
    {`Have a ${requirement.data.id} badge`}
  </RequirementCard>
)

export default HundredNOneRequirementCard
