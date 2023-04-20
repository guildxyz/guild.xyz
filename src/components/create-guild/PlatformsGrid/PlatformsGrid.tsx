import { SimpleGrid } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { PlatformName } from "types"
import PlatformSelectButton from "./components/PlatformSelectButton"
import useGoogleButtonProps from "./hooks/useGoogleButtonProps"
import useOAuthButtonProps from "./hooks/useOAuthButtonProps"

type Props = {
  onSelection: (platform: PlatformName) => void
  showPoap?: boolean
}

const PlatformsGrid = ({ onSelection, showPoap = false }: Props) => {
  // TODO: move back out of the component and remove optional POAP logic once it'll be a real reward
  const platformsData: Record<
    Exclude<PlatformName, "" | "TWITTER" | "POAP">,
    {
      description: string
      hook?: any
    }
  > = {
    DISCORD: {
      description: "Manage roles",
      hook: useOAuthButtonProps,
    },
    TELEGRAM: {
      description: "Manage groups",
    },
    GOOGLE: {
      description: "Manage documents",
      hook: useGoogleButtonProps,
    },
    GITHUB: {
      description: "Manage repositories",
      hook: useOAuthButtonProps,
    },
    ...(showPoap
      ? {
          POAP: {
            description: "Mint POAP",
          },
        }
      : {}),
  }

  return (
    <SimpleGrid
      data-test="platforms-grid"
      columns={{ base: 1, md: 2 }}
      gap={{ base: 4, md: 5 }}
    >
      {Object.entries(platformsData).map(([platform, { description, hook }]) => (
        <PlatformSelectButton
          key={platform}
          platform={platform}
          hook={hook}
          title={platforms[platform].name}
          description={description}
          imageUrl={`/platforms/${platform.toLowerCase()}.png`}
          onSelection={onSelection}
          size="md"
        />
      ))}
    </SimpleGrid>
  )
}

export default PlatformsGrid
