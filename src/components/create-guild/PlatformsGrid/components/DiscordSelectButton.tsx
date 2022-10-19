import { PlatformName } from "types"
import BaseOAuthSelectButton from "./BaseOAuthSelectButton"

type Props = {
  onSelection: (platform: PlatformName) => void
}

const DiscordSelectButton = ({ onSelection }: Props) => (
  <BaseOAuthSelectButton
    buttonText="Select server"
    colorScheme="DISCORD"
    onSelection={onSelection}
    platform="DISCORD"
  />
)

export default DiscordSelectButton
