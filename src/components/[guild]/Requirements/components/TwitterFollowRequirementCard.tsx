import { Icon } from "@chakra-ui/react"
import Link from "components/common/Link"
import { TwitterLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const TwitterFollowRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={
      requirement.data.id ? (
        `${
          process.env.NODE_ENV === "production"
            ? "https://guild-xyz-git-twitter-avatar-optimization-zgen.vercel.app"
            : "http://localhost:3000"
        }/api/twitter-avatar?username=${requirement.data.id}`
      ) : (
        <Icon as={TwitterLogo} boxSize={6} />
      )
    }
    footer={<ConnectRequirementPlatformButton platform="TWITTER" />}
  >
    {`Follow `}
    <Link
      href={`https://twitter.com/${requirement.data.id}`}
      isExternal
      colorScheme={"blue"}
      fontWeight="medium"
    >
      @{requirement.data.id}
    </Link>
  </RequirementCard>
)

export default TwitterFollowRequirementCard
