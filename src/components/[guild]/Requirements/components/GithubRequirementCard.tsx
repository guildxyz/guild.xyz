import { Icon } from "@chakra-ui/react"
import Link from "components/common/Link"
import { GithubLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const GithubRequirementCard = ({ requirement, ...rest }: Props) => (
  <RequirementCard
    image={<Icon as={GithubLogo} boxSize={6} />}
    footer={<ConnectRequirementPlatformButton platform="GITHUB" />}
    {...rest}
  >
    Give a star to the{" "}
    <Link
      href={requirement.data.id ?? ""}
      isExternal
      colorScheme={"blue"}
      fontWeight="medium"
    >
      {requirement.data.id.match(/https:\/\/github\.com\/(.+)$/i)[1]}
    </Link>{" "}
    repository
  </RequirementCard>
)

export default GithubRequirementCard
