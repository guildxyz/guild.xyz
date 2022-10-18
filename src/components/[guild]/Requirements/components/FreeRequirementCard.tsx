import { Icon } from "@chakra-ui/react"
import { Wallet } from "phosphor-react"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const FreeRequirementCard = ({ requirement, ...rest }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Icon as={Wallet} boxSize={6} />}
    {...rest}
  >
    Connect your Ethereum wallet
  </RequirementCard>
)

export default FreeRequirementCard
