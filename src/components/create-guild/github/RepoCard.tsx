import { Button } from "@chakra-ui/react"
import OptionCard from "components/common/OptionCard"
import useGuildByPlatformId from "components/guard/setup/hooks/useDiscordGuildByPlatformId"
import Link from "next/link"
import getRandomInt from "utils/getRandomInt"
import useCreateGuild from "../hooks/useCreateGuild"

const RepoCard = ({
  onSelection,
  avatarUrl,
  platformGuildId,
  repositoryName,
  description,
}: {
  onSelection: (platformGuildId: string) => void
  avatarUrl: string
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
    <OptionCard
      height="full"
      image={avatarUrl}
      title={repositoryName}
      description={description}
    >
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
    </OptionCard>
  )
}

export default RepoCard
