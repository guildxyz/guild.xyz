import { Icon } from "@chakra-ui/react"
import { Wallet } from "phosphor-react"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"
import RequirementText from "./common/RequirementText"

type Props = {
  requirement: Requirement
}

const FreeRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Icon as={Wallet} boxSize={6} />}
  >
    <RequirementText>Connect your Ethereum wallet</RequirementText>
  </RequirementCard>
)

export default FreeRequirementCard
