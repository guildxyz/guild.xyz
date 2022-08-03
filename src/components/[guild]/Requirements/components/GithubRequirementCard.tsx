import { Icon } from "@chakra-ui/react"
import Link from "components/common/Link"
import { GithubLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectPlatformButton from "./common/ConnectPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const GithubRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Icon as={GithubLogo} boxSize={6} />}
    footer={<ConnectPlatformButton platform="GITHUB" />}
  >
    Give a star to the{" "}
    <Link href={requirement.data.id ?? ""} isExternal>
      {requirement.data.id.match(/https:\/\/github\.com\/(.+)$/i)[1]}
    </Link>{" "}
    repository
  </RequirementCard>
)

export default GithubRequirementCard
