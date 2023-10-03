import { SimpleGrid, Stack } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { PlatformName } from "types"
import PlatformSelectButton from "./components/PlatformSelectButton"

type Props = {
  onSelection: (platform: PlatformName) => void
  showPoap?: boolean
}

type PlatformsGridData = {
  description?: string
}

const PlatformsGrid = ({ onSelection, showPoap = false }: Props) => {
  // TODO: move back out of the component and remove optional POAP logic once it'll be a real reward
  const platformsData: Record<
    Exclude<PlatformName, "" | "TWITTER" | "TWITTER_V1" | "POAP" | "EMAIL">,
    PlatformsGridData
  > = {
    DISCORD: {
      description: "Manage roles",
    },
    TELEGRAM: {
      description: "Manage groups",
    },
    GOOGLE: {
      description: "Manage documents",
    },
    GITHUB: {
      description: "Manage repositories",
    },
    ...(showPoap
      ? {
          POAP: {
            description: "Mint POAP",
          },
        }
      : {}),
    CONTRACT_CALL: {
      description: "Create a gated NFT",
    },
    TEXT: {
      description: "Show a secret for the users",
    },
  }

  return (
    <Stack spacing={8}>
      <SimpleGrid
        data-test="platforms-grid"
        columns={{ base: 1, md: 2 }}
        gap={{ base: 4, md: 5 }}
      >
        {Object.entries(platformsData).map(
          ([platform, { description }]: [PlatformName, { description: string }]) => (
            <PlatformSelectButton
              key={platform}
              platform={platform}
              title={platforms[platform].name}
              description={description}
              icon={platforms[platform].icon}
              imageUrl={platforms[platform].imageUrl}
              onSelection={onSelection}
            />
          )
        )}
      </SimpleGrid>
    </Stack>
  )
}

export default PlatformsGrid
