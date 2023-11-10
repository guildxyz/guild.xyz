import { SimpleGrid, Stack } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, PlatformName } from "types"
import MultiPlatformSelectButton from "./components/MultiPlatformSelectButton"

type Props = {
  onSelection: (platform: PlatformName) => void
  showPoap?: boolean
}

const MultiPlatformsGrid = ({ onSelection }: Props) => {
  const platformsData: Array<PlatformName> = [
    "DISCORD",
    "TELEGRAM",
    "GOOGLE",
    "GITHUB",
    "CONTRACT_CALL",
    "TWITTER",
  ]
  const { control } = useFormContext<GuildFormType>()
  const guildPlatforms = useWatch({
    name: "guildPlatforms",
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
            title={platforms[platform].name}
            //TODO get discord server name
            description={
              guildPlatforms.find(
                (guildPlatform) => guildPlatform.platformName === platform
              )?.platformGuildData.name
            }
            icon={platforms[platform].icon}
            imageUrl={platforms[platform].imageUrl}
            onSelection={onSelection}
          />
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export default MultiPlatformsGrid
