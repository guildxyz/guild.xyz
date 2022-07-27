import { Button, HStack, Text, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import useGuildByPlatformId from "components/guard/setup/hooks/useDiscordGuildByPlatformId"
import Link from "next/link"
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
  description: string
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
      guildPlatforms: [
        {
          platformName: "GITHUB",
          platformGuildId,
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

  return (
    <Card padding={4}>
      <HStack justifyContent={"space-between"} w="full" h="full">
        {description?.length > 0 ? (
          <VStack spacing={0} alignItems="start">
            <Text fontWeight={"bold"}>{repositoryName}</Text>

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
          <Text fontWeight={"bold"}>{repositoryName}</Text>
        )}

        {isLoading ? (
          <Button isLoading />
        ) : id ? (
          <Link href={`/${urlName}`} passHref>
            <Button
              as="a"
              colorScheme="gray"
              data-dd-action-name="Go to guild [gh repo setup]"
            >
              Go to guild
            </Button>
          </Link>
        ) : (
          <Button
            isLoading={isCreationLoading || isCreationSigning}
            loadingText={signLoadingText || "Saving data"}
            colorScheme="whiteAlpha"
            onClick={onSelection ? () => onSelection(platformGuildId) : handleClick}
          >
            Select
          </Button>
        )}
      </HStack>
    </Card>
  )
}

export default RepoCard
