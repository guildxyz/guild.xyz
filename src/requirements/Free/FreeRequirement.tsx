import { PiIcon } from "@chakra-ui/react"
import Requirement from "components/[guild]/Requirements/components/Requirement"
import type { PiIcon as PhosphorIcon } from "react-icons/pi"
import REQUIREMENTS from "requirements"

const FreeRequirement = ({ ...rest }) => (
  <Requirement
    image={<PiIcon as={REQUIREMENTS.FREE.icon as PhosphorIcon} boxSize={6} />}
    {...rest}
  >
    Open access
  </Requirement>
)

export default FreeRequirement
