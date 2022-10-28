import { Img } from "@chakra-ui/react"
import { Requirement } from "types"
import shortenHex from "utils/shortenHex"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const CaskRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Img src="/requirementLogos/cask.jpg" />}
  >
    {`Subscribe to ${requirement.data.planId} from ${shortenHex(
      requirement.data.provider
    )}`}
  </RequirementCard>
)

export default CaskRequirementCard
