import { Icon } from "@chakra-ui/react"
import { Wallet } from "phosphor-react"
import Requirement from "./common/Requirement"

const FreeRequirement = ({ ...rest }) => (
  <Requirement image={<Icon as={Wallet} boxSize={6} />} {...rest}>
    Connect your Ethereum wallet
  </Requirement>
)

export default FreeRequirement
