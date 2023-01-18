import { Img, Link } from "@chakra-ui/react"
import { RequirementComponentProps } from "requirements"
import Requirement from "../common/Requirement"

const OrangeRequirement = ({ requirement, ...rest }: RequirementComponentProps) => (
  <Requirement
    isNegated={requirement.isNegated}
    image={<Img src="/requirementLogos/orange.png" />}
    {...rest}
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

export default OrangeRequirement
