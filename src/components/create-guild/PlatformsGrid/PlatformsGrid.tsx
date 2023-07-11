import { SimpleGrid, Stack } from "@chakra-ui/react"
import Section from "components/common/Section"
import platforms from "platforms/platforms"
import { PlatformName } from "types"
import PlatformSelectButton, {
  PlatformHookType,
} from "./components/PlatformSelectButton"
import useGoogleButtonProps from "./hooks/useGoogleButtonProps"
import useOAuthButtonProps from "./hooks/useOAuthButtonProps"

type Props = {
  onSelection: (platform: PlatformName) => void
  showPoap?: boolean
}

type PlatformsGridData = {
  description?: string
  hook?: PlatformHookType
}

const generalPlatformsData: PlatformName[] = ["CONTRACT_CALL"]

const PlatformsGrid = ({ onSelection, showPoap = false }: Props) => {
  // TODO: move back out of the component and remove optional POAP logic once it'll be a real reward
  const platformsData: Record<
    Exclude<PlatformName, "" | "TWITTER" | "POAP" | "CONTRACT_CALL">,
    PlatformsGridData
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
    <Stack spacing={8}>
      <SimpleGrid
        data-test="platforms-grid"
        columns={{ base: 1, md: 2 }}
        gap={{ base: 4, md: 5 }}
      >
        {Object.entries(platformsData).map(
          ([platform, { description, hook }]: [
            PlatformName,
            { description: string; hook?: PlatformHookType }
          ]) => (
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
          )
        )}
      </SimpleGrid>
      <Section title="General">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 5 }}>
          {generalPlatformsData.map((platformName) => (
            <PlatformSelectButton
              key={platformName}
              platform={platformName}
              title={platforms[platformName].name}
              icon={platforms[platformName].icon}
              onSelection={onSelection}
            />
          ))}
        </SimpleGrid>
      </Section>
    </Stack>
  )
}

export default PlatformsGrid
