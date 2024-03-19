import { SimpleGrid, Stack } from "@chakra-ui/react"
import rewards from "platforms/rewards"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, PlatformName } from "types"
import MultiPlatformSelectButton from "./components/MultiPlatformSelectButton"

type Props = {
  onSelection: (platform: PlatformName) => void
}

const MultiPlatformsGrid = ({ onSelection }: Props) => {
  const platformsData: Array<PlatformName> = [
    "DISCORD",
    "TWITTER",
    "TELEGRAM",
    "GOOGLE",
    "GITHUB",
    "CONTRACT_CALL",
  ]
  const { control } = useFormContext<GuildFormType>()
  const guildPlatforms = useWatch({
    name: "guildPlatforms",
    control,
  })
  const twitterLink = useWatch({
    name: "socialLinks.TWITTER",
    control,
  })

  return (
    <Stack spacing={8}>
      <SimpleGrid
        data-test="platforms-grid"
        columns={{ base: 1, md: 3 }}
        gap={{ base: 4, md: 5 }}
      >
        {platformsData.map((platform) => (
          <MultiPlatformSelectButton
            key={platform}
            platform={platform}
            title={rewards[platform].name}
            description={
              platform === "TWITTER"
                ? twitterLink
                : guildPlatforms.find(
                    (guildPlatform) => guildPlatform.platformName === platform,
                  )?.platformGuildData.name
            }
            icon={rewards[platform].icon}
            imageUrl={rewards[platform].imageUrl}
            onSelection={onSelection}
          />
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export default MultiPlatformsGrid
