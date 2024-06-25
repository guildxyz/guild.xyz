import { Icon } from "@chakra-ui/react"
import Requirement from "components/[guild]/Requirements/components/Requirement"
import { Icon as PhosphorIcon } from "phosphor-react"
import REQUIREMENTS from "requirements"

const FreeRequirement = ({ ...rest }) => (
  <Requirement
    image={<Icon as={REQUIREMENTS.FREE.icon as PhosphorIcon} boxSize={6} />}
    {...rest}
  >
    Open access
  </Requirement>
)

export default FreeRequirement
