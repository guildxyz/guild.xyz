import { Img, Link } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"

const OrangeRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={<Img src="/requirementLogos/orange.png" />}
      {...props}
    >
      {`Have the badge of Orange campaign `}
      <Link
        href={`https://poap.gallery/event/${requirement.data.id}`}
        isExternal
        display="inline"
        colorScheme="blue"
        fontWeight="medium"
      >
        {requirement.data.id}
      </Link>
    </Requirement>
  )
}

export default OrangeRequirement
