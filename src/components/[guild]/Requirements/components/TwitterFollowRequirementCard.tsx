import { HStack, Icon, Text } from "@chakra-ui/react"
import Link from "components/common/Link"
import useTwitterAvatar from "hooks/useTwitterAvatar"
import { TwitterLogo } from "phosphor-react"
import { Requirement } from "types"
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
    >
      <HStack>
        <Text>Follow</Text>
        <Link href={`https://twitter.com/${requirement.data.id}`} isExternal>
          @{requirement.data.id}
        </Link>
      </HStack>
    </RequirementCard>
  )
}

export default TwitterFollowRequirementCard
