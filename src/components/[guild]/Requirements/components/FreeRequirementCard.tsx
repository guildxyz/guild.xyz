import { Icon } from "@chakra-ui/react"
import { Wallet } from "phosphor-react"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const FreeRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Icon as={Wallet} boxSize={6} />}
  >
    Connect your Ethereum wallet
  </RequirementCard>
)

export default FreeRequirementCard
