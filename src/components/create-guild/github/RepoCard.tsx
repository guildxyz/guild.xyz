import { HStack, Skeleton, Text, VStack } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Link from "components/common/Link"
import useGuildByPlatformId from "hooks/useGuildByPlatformId"
import NextLink from "next/link"
import getRandomInt from "utils/getRandomInt"
import useCreateGuild from "../hooks/useCreateGuild"

const RepoCard = ({
  onSelection,
  platformGuildId,
  repositoryName,
  description,
}: {
  onSelection: (platformGuildId: string) => void
  platformGuildId: string
  repositoryName: string
  description?: string
}) => {
  const {
    onSubmit: onCreateGuild,
    isLoading: isCreationLoading,
    isSigning: isCreationSigning,
    signLoadingText,
  } = useCreateGuild()

  const { id, isLoading, urlName } = useGuildByPlatformId(
    "GITHUB",
    encodeURIComponent(platformGuildId)
  )

  const handleClick = () => {
    onCreateGuild({
      name: repositoryName,
      description,
      imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
      theme: { color: "#4d4d4d" },
      guildPlatforms: [
        {
          platformName: "GITHUB",
          platformGuildId: encodeURIComponent(platformGuildId),
        },
      ],
      roles: [
        {
          name: "Member",
          logic: "AND",
          imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
          requirements: [{ type: "FREE" }],
          rolePlatforms: [
            {
              guildPlatformIndex: 0,
            },
          ],
        },
      ],
    })
  }

  const RepoName = () => (
    <Link href={`https://github.com/${platformGuildId}`} isExternal>
      <Text fontWeight={"bold"}>{platformGuildId}</Text>
    </Link>
  )

  return (
    <Card padding={4}>
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

        {isLoading ? (
          <Button isLoading />
        ) : id ? (
          <NextLink href={`/${urlName}`} passHref>
            <Button
              as="a"
              colorScheme="gray"
              data-dd-action-name="Go to guild [gh repo setup]"
            >
              Go to guild
            </Button>
          </NextLink>
        ) : (
          <Button
            isLoading={isCreationLoading || isCreationSigning}
            loadingText={signLoadingText || "Saving data"}
            colorScheme="GITHUB"
            onClick={onSelection ? () => onSelection(platformGuildId) : handleClick}
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
