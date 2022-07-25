import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react"
import OptionCard from "components/common/OptionCard"
import { PlatformName } from "types"
import DiscordSelectButton from "./components/DiscordSelectButton"
import GoogleSelectButton from "./components/GoogleSelectButton"
import TelegramSelectButton from "./components/TelegramSelectButton"

type Props = {
  onSelection: (platform: PlatformName) => void
  columns?: SimpleGridProps["columns"]
}

const platforms: Partial<
  Record<
    PlatformName,
    {
      description: string
      label: string
      Btn?: (props: { onSelection: Props["onSelection"] }) => JSX.Element
    }
  >
> = {
  DISCORD: {
    description: "Manage roles & guard server",
    label: "Discord",
    Btn: DiscordSelectButton,
  },
  TELEGRAM: {
    description: "Token gate your group",
    label: "Telegram",
    Btn: TelegramSelectButton,
  },
  GOOGLE: {
    description: "Token gate documents",
    label: "Google Workspace",
    Btn: GoogleSelectButton,
  },
}

const PlatformsGrid = ({ onSelection, columns = { base: 1, md: 2 } }: Props) => (
  <SimpleGrid columns={columns} gap={{ base: 4, md: 6 }}>
    {Object.entries(platforms).map(([platformName, { description, Btn, label }]) => (
      <OptionCard
        key={platformName}
        size="lg"
        title={label}
        image={`/platforms/${platformName.toLowerCase()}.png`}
        bgImage={`/platforms/${platformName.toLowerCase()}_bg.png`}
        description={description}
      >
        {Btn && <Btn onSelection={onSelection} />}
      </OptionCard>
    ))}
  </SimpleGrid>
)

export { platforms }
export default PlatformsGrid
