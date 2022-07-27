import { Center, HStack, Icon, Spinner, Text } from "@chakra-ui/react"
import Link from "components/common/Link"
import useTwitterAvatar from "hooks/useTwitterAvatar"
import Image from "next/image"
import { TwitterLogo } from "phosphor-react"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const TwitterFollowRequirementCard = ({ requirement }: Props) => {
  const { url, isLoading } = useTwitterAvatar(requirement.data.username)

  return (
    <RequirementCard
      requirement={requirement}
      image={<Icon as={TwitterLogo} boxSize={6} />}
    >
      <HStack>
        <Text>Follow</Text>
        <Link href={`https://twitter.com/${requirement.data.username}`} isExternal>
          @{requirement.data.username}
        </Link>
        <Center
          position={"relative"}
          width={5}
          height={5}
          borderRadius="lg"
          overflow={"hidden"}
        >
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <Image
              src={url ?? "/default_telegram_icon.png"}
              alt="Twitter avatar"
              layout="fill"
            />
          )}
        </Center>
      </HStack>
    </RequirementCard>
  )
}

export default TwitterFollowRequirementCard
