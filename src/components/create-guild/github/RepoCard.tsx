import { Button } from "@chakra-ui/react"
import OptionCard from "components/common/OptionCard"
import getRandomInt from "utils/getRandomInt"
import useCreateGuild from "../hooks/useCreateGuild"

const RepoCard = ({
  avatarUrl,
  platformGuildId,
  repositoryName,
  description,
}: {
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
      <Button
        isLoading={isCreationLoading || isCreationSigning}
        loadingText={signLoadingText || "Saving data"}
        colorScheme="whiteAlpha"
        onClick={handleClick}
      >
        Select
      </Button>
    </OptionCard>
  )
}

export default RepoCard
