import { PlatformName } from "types"
import BaseOAuthButton from "./BaseOAuthButton"

type Props = {
  onSelection: (platform: PlatformName) => void
}

const TwitterSelectButton = ({ onSelection }: Props) => (
  <BaseOAuthButton buttonText="TODO" onSelection={onSelection} platform="TWITTER" />
)

export default TwitterSelectButton
