import { HStack, Skeleton, Text, VStack } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Link from "components/common/Link"
import NextLink from "next/link"
import usePlatformUsageInfo from "platforms/hooks/usePlatformUsageInfo"

const RepoCard = ({
  onSelection,
  platformGuildId,
  description,
}: {
  onSelection: (platformGuildId: string) => void
  platformGuildId: string
  repositoryName: string
  description?: string
}) => {
  const { isAlreadyInUse, guildUrlName, isValidating } = usePlatformUsageInfo(
    "GITHUB",
    encodeURIComponent(platformGuildId)
  )

  const RepoName = () => (
    <Link href={`https://github.com/${platformGuildId}`} isExternal>
      <Text fontWeight="bold" noOfLines={1}>
        {platformGuildId}
      </Text>
    </Link>
  )

  return (
    <Card padding={4} h="full">
      <HStack justifyContent={"space-between"} w="full" h="full">
        {description?.length > 0 ? (
          <VStack spacing={0} alignItems="start">
            <RepoName />

            <Text
              color="gray"
              maxW={"3xs"}
              textOverflow="ellipsis"
              overflow={"hidden"}
              whiteSpace={"nowrap"}
            >
              {description}
            </Text>
          </VStack>
        ) : (
          <RepoName />
        )}

        {isValidating ? (
          <Button isLoading />
        ) : isAlreadyInUse ? (
          <NextLink href={`/${guildUrlName}`} passHref>
            <Button as="a" colorScheme="gray" minW="max-content">
              Go to guild
            </Button>
          </NextLink>
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
