import { Button } from "@chakra-ui/react"
import ActionCard from "components/common/ActionCard"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import type { Platforms as PlatformsType } from "temporaryData/types"

type Props = {
  data: PlatformsType
}

const Platforms = ({ data }: Props): JSX.Element => (
  <ActionCard
    title="Platforms"
    description="All platforms are bridged together so you’ll see the same messages everywhere."
  >
    {data.telegram.active && (
      <Button colorScheme="telegram" fontWeight="medium" leftIcon={<TelegramLogo />}>
        Join Telegram
      </Button>
    )}
    {data.discord.active && (
      <Button colorScheme="discord" fontWeight="medium" leftIcon={<DiscordLogo />}>
        Join Discord
      </Button>
    )}
  </ActionCard>
)

export default Platforms
