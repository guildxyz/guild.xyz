import { Icon } from "@chakra-ui/react"
import Link from "components/common/Link"
import useTwitterAvatar from "hooks/useTwitterAvatar"
import { TwitterLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const TwitterFollowRequirementCard = ({ requirement }: Props) => {
  const { url, isLoading } = useTwitterAvatar(requirement.data.id)

  return (
    <RequirementCard
      requirement={requirement}
      image={url ?? <Icon as={TwitterLogo} boxSize={6} />}
      loading={isLoading}
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
}

export default TwitterFollowRequirementCard
