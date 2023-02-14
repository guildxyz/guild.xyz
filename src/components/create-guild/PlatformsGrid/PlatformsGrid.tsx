import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react"
import OptionCard from "components/common/OptionCard"
import platforms from "platforms"
import { PlatformName } from "types"
import DiscordSelectButton from "./components/DiscordSelectButton"
import GitHubSelectButton from "./components/GitHubSelectButton"
import GoogleSelectButton from "./components/GoogleSelectButton"
import PoapSelectButton from "./components/PoapSelectButton"
import TelegramSelectButton from "./components/TelegramSelectButton"

type Props = {
  onSelection: (platform: PlatformName) => void
  columns?: SimpleGridProps["columns"]
  showPoap?: boolean
}

const PlatformsGrid = ({
  onSelection,
  columns = { base: 1, md: 2 },
  showPoap = false,
}: Props) => {
  // TODO: move back out of the component and remove optional POAP logic once it'll be a real reward
  const platformsData: Record<
    Exclude<PlatformName, "" | "TWITTER" | "POAP">,
    {
      description: string
      Btn?: (props: { onSelection: Props["onSelection"] }) => JSX.Element
    }
  > = {
    DISCORD: {
      description: "Token gate roles",
      Btn: DiscordSelectButton,
    },
    TELEGRAM: {
      description: "Token gate your group",
      Btn: TelegramSelectButton,
    },
    GOOGLE: {
      description: "Token gate documents",
      Btn: GoogleSelectButton,
    },
    GITHUB: {
      description: "Token gate your repositories",
      Btn: GitHubSelectButton,
    },
    ...(showPoap
      ? {
          POAP: {
            description: "Drop POAPs",
            Btn: PoapSelectButton,
          },
        }
      : {}),
  }

  return (
    <SimpleGrid columns={columns} gap={{ base: 4, md: 6 }}>
      {Object.entries(platformsData).map(([platformName, { description, Btn }]) => (
        <OptionCard
          key={platformName}
          size="lg"
          title={platforms[platformName].name}
          image={`/platforms/${platformName.toLowerCase()}.png`}
          bgImage={`/platforms/${platformName.toLowerCase()}_bg.png`}
          description={description}
        >
          {Btn && <Btn onSelection={onSelection} />}
        </OptionCard>
      ))}
    </SimpleGrid>
  )
}

export default PlatformsGrid
