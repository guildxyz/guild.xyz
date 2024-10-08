import { Requirement } from "components/[guild]/Requirements/components/Requirement"
import REQUIREMENTS from "requirements"

const FreeRequirement = ({ ...rest }) => {
  const IconComponent = REQUIREMENTS.FREE.icon

  return (
    <Requirement
      image={<IconComponent weight="bold" className="size-6" />}
      {...rest}
    >
      Open access
    </Requirement>
  )
}

export default FreeRequirement
