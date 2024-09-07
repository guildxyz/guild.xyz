import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import REQUIREMENTS from "requirements"

const WorldIDRequirement = (props: RequirementProps) => {
  const { data } = useRequirementContext<"WORLD_ID_VERIFICATION">()

  return (
    <Requirement
      image={REQUIREMENTS.WORLD_ID_VERIFICATION.icon as string}
      footer={<ConnectRequirementPlatformButton />}
      {...props}
    >
      {`Have a World ID account connected with ${data.id === "orb" ? "Orb" : "Device"} verification level`}
    </Requirement>
  )
}

export default WorldIDRequirement
