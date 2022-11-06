import { Icon } from "@chakra-ui/react"
import { Wallet } from "phosphor-react"
import RequirementCard from "./common/RequirementCard"

const FreeRequirementCard = ({ ...rest }) => (
  <RequirementCard image={<Icon as={Wallet} boxSize={6} />} {...rest}>
    Connect your Ethereum wallet
  </RequirementCard>
)

export default FreeRequirementCard
