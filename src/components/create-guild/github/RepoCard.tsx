import { Link } from "@chakra-ui/next-js"
import { HStack, Skeleton, Text, VStack } from "@chakra-ui/react"
import { GitHubGateable } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import NextLink from "next/link"

const RepoCard = ({
  onSelection,
  platformGuildId,
  isGuilded,
  guildId,
  description,
}: {
  onSelection: (platformGuildId: string) => void
} & GitHubGateable) => {
  const { id } = useGuild() ?? {}

  const isUsedInCurrentGuild = isGuilded && guildId === id

  const RepoName = () => (
    <Link href={`https://github.com/${platformGuildId}`} isExternal>
      <Text fontWeight="bold" noOfLines={1}>
        {platformGuildId}
      </Text>
    </Link>
  )

  if (isUsedInCurrentGuild) return null

  return (
    <CardMotionWrapper>
      <Card padding={4} h="full">
        <HStack justifyContent={"space-between"} w="full" h="full">
          {description?.length > 0 ? (
            <VStack spacing={0} alignItems="start">
              <RepoName />

              <Text color="gray" noOfLines={1}>
                {description}
              </Text>
            </VStack>
          ) : (
            <RepoName />
          )}

          {isGuilded ? (
            <Button
              as={NextLink}
              href={`/${guildId}`}
              colorScheme="gray"
              minW="max-content"
            >
              Go to guild
            </Button>
          ) : (
            <Button
              flexShrink={0}
              colorScheme="GITHUB"
              onClick={() => onSelection(platformGuildId)}
            >
              Gate repo
            </Button>
          )}
        </HStack>
      </Card>
    </CardMotionWrapper>
  )
}

const RepoSkeletonCard = () => (
  <Card padding={4}>
    <HStack justifyContent={"space-between"} w="full" h="full">
      <Skeleton h={4} w={200} />
      <Skeleton h={10} borderRadius="xl" w={110} opacity={0.4} />
    </HStack>
  </Card>
)

export default RepoCard
export { RepoSkeletonCard }
