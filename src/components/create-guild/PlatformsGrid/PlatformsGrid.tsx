import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react"
import OptionCard from "components/common/OptionCard"
import { useRouter } from "next/router"
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

const PlatformsGrid = ({ onSelection, columns = { base: 1, md: 2 } }: Props) => {
  const router = useRouter()

  return (
    <SimpleGrid columns={columns} gap={{ base: 4, md: 6 }}>
      {Object.entries(platforms).map(
        ([platformName, { description, Btn, label }]) => {
          // Temporarily hiding Google. We should revert these changes once the application is approved.
          if (
            router.query.allPlatforms?.toString() !== "true" &&
            platformName === "GOOGLE"
          )
            return null

          return (
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
          )
        }
      )}
    </SimpleGrid>
  )
}

export { platforms }
export default PlatformsGrid
