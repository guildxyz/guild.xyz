import { PlatformName } from "types"
import BaseOAuthButton from "./BaseOAuthButton"

type Props = {
  onSelection: (platform: PlatformName) => void
}

const GitHubSelectButton = ({ onSelection }: Props) => (
  <BaseOAuthButton
    buttonText="Select repo"
    onSelection={onSelection}
    platform="GITHUB"
  />
)

export default GitHubSelectButton
