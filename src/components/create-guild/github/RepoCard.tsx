import { Button, HStack, Text, useBreakpointValue, VStack } from "@chakra-ui/react"
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

  const NameDescriptionStack = useBreakpointValue({ base: VStack, lg: HStack })

  return (
    <HStack
      justifyContent={"space-between"}
      w="full"
      backgroundColor={"GITHUB.500"}
      padding={4}
      borderRadius="xl"
    >
      <NameDescriptionStack spacing={{ base: 0, lg: 10 }} alignItems="start">
        <Text fontWeight={"bold"}>{repositoryName}</Text>

        <Text
          color="gray"
          maxW={{ base: "3xs", sm: "xs", md: "sm", lg: "md" }}
          textOverflow="ellipsis"
          overflow={"hidden"}
          whiteSpace={"nowrap"}
        >
          {description}
        </Text>
      </NameDescriptionStack>

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
  )
}

export default RepoCard
