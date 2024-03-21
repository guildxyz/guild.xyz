import { Icon } from "@chakra-ui/react"
import Requirement from "components/[guild]/Requirements/components/Requirement"
import { LockOpen } from "phosphor-react"

const FreeRequirement = ({ ...rest }) => (
  <Requirement image={<Icon as={LockOpen} boxSize={6} />} {...rest}>
    Open access
  </Requirement>
)

export default FreeRequirement
