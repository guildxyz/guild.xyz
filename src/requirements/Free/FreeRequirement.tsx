import { Icon } from "@chakra-ui/react"
import { Icon as PhosphorIcon } from "@phosphor-icons/react/dist/lib/types"
import Requirement from "components/[guild]/Requirements/components/Requirement"
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
