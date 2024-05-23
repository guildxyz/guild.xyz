import { Box, Heading, SimpleGrid, Stack, StackProps } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import rewards from "platforms/rewards"
import { PlatformName, PlatformType } from "types"
import PlatformSelectButton from "./components/PlatformSelectButton"

type Props = {
  onSelection: (platform: PlatformName) => void
  disabledRewards?: Partial<Record<PlatformName, string>>
} & StackProps

type PlatformsGridData = {
  platform: PlatformName
  description?: string
  isGeneral?: boolean
}

const PlatformsGrid = ({ onSelection, disabledRewards, ...rest }: Props) => {
  const { guildPlatforms, featureFlags } = useGuild()

  // TODO: move back out of the component and remove optional POAP logic once it'll be a real reward
  const platformsData: PlatformsGridData[] = [
    {
      platform: "DISCORD",
      description: "Manage roles",
    },
    {
      platform: "TELEGRAM",
      description: "Manage groups",
    },
    {
      platform: "GOOGLE",
      description: "Manage documents",
    },
    {
      platform: "GITHUB",
      description: "Manage repositories",
    },
    {
      platform: "POAP",
      description: "Mint POAP",
    },
    {
      platform: "GATHER_TOWN",
      description: "Manage spaces",
    },
    ...(!guildPlatforms.find(
      (platform) => platform.platformId === PlatformType.POLYGON_ID
    )
      ? [
          {
            platform: "POLYGON_ID",
            description: "Prove role membership",
          } as PlatformsGridData,
        ]
      : []),
    {
      platform: "TEXT",
      description: "Gate special content, links, etc",
      isGeneral: true,
    },
    {
      platform: "CONTRACT_CALL",
      description: "Create a gated NFT",
      isGeneral: true,
    },
    {
      platform: "POINTS",
      description: "Gamification utility",
      isGeneral: true,
    },
    ...(featureFlags.includes("ERC20")
      ? [
          {
            platform: "ERC20",
            description: "Create airdrops, reward tokens",
            isGeneral: true,
          } as PlatformsGridData,
        ]
      : []),
    {
      platform: "FORM",
      description: "Gather responses",
      isGeneral: true,
    },
  ]

  return (
    <Stack spacing={7} {...rest}>
      <PlatformSelectButtons
        platformsData={platformsData.filter((p) => !p.isGeneral)}
        onSelection={onSelection}
        disabledRewards={disabledRewards}
      />

      <Box>
        <Heading as="h3" fontSize={"md"} mb="3">
          General
        </Heading>
        <PlatformSelectButtons
          platformsData={platformsData.filter((p) => p.isGeneral)}
          onSelection={onSelection}
          disabledRewards={disabledRewards}
        />
      </Box>
    </Stack>
  )
}

const PlatformSelectButtons = ({
  platformsData,
  onSelection,
  disabledRewards,
}: {
  platformsData: PlatformsGridData[]
  onSelection: Props["onSelection"]
  disabledRewards?: Props["disabledRewards"]
}) => (
  <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 5 }}>
    {platformsData.map(({ platform, description }) => (
      <PlatformSelectButton
        key={platform}
        platform={platform}
        title={rewards[platform].name}
        description={description}
        icon={rewards[platform].icon}
        imageUrl={rewards[platform].imageUrl}
        onSelection={onSelection}
        disabledText={disabledRewards?.[platform]}
      />
    ))}
  </SimpleGrid>
)

export default PlatformsGrid
