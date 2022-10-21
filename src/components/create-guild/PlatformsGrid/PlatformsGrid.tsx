import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react"
import OptionCard from "components/common/OptionCard"
import { useRouter } from "next/router"
import platforms from "platforms"
import { PlatformName } from "types"
import DiscordSelectButton from "./components/DiscordSelectButton"
import GitHubSelectButton from "./components/GitHubSelectButton"
import GoogleSelectButton from "./components/GoogleSelectButton"
import TelegramSelectButton from "./components/TelegramSelectButton"

type Props = {
  onSelection: (platform: PlatformName) => void
  columns?: SimpleGridProps["columns"]
}

/**
 * TODO: Add a type "GateablePlatforms", so we can do Record<GateablePlatforms,
 * (props) => JSX.Element> here
 */
const platformsData: Record<
  Exclude<PlatformName, "" | "TWITTER" | "SPOTIFY">,
  {
    description: string
    Btn?: (props: { onSelection: Props["onSelection"] }) => JSX.Element
  }
> = {
  DISCORD: {
    description: "Manage roles & guard server",
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
}

const PlatformsGrid = ({ onSelection, columns = { base: 1, md: 2 } }: Props) => {
  const router = useRouter()

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
