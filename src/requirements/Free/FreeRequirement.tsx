import { Icon } from "@chakra-ui/react"
import Requirement from "components/[guild]/Requirements/components/Requirement"
import { Wallet } from "phosphor-react"

const FreeRequirement = ({ ...rest }) => (
  <Requirement image={<Icon as={Wallet} boxSize={6} />} {...rest}>
    Connect your Ethereum wallet
  </Requirement>
)

export default FreeRequirement
