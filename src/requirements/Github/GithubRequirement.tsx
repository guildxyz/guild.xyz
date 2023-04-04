import { Icon } from "@chakra-ui/react"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { GithubLogo } from "phosphor-react"

const GithubRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  return (
    <Requirement
      image={<Icon as={GithubLogo} boxSize={6} />}
      footer={<ConnectRequirementPlatformButton />}
      {...props}
    >
      {/* Give a star to the{" "}
      <Link
        href={requirement.data.id ?? ""}
        isExternal
        colorScheme="blue"
        fontWeight="medium"
      >
        {requirement.data.id.match(/https:\/\/github\.com\/(.+)$/i)[1]}
      </Link>{" "}
      repository */}
    </Requirement>
  )
}

export default GithubRequirement
