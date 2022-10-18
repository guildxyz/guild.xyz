import { Img } from "@chakra-ui/react"
import { VerisoulParamType, Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const VerisoulRequirementCard = ({ requirement }: Props) => {
  // TODO: Add details about the requirement
  //const param = requirement.data.params as VerisoulParamType;
  return (
    <RequirementCard
      requirement={requirement}
      image={<Img src="/requirementLogos/verisoul.png" />}
    >
      {`Be Verisoul Verified`}
    </RequirementCard>
  )
}

export default VerisoulRequirementCard
