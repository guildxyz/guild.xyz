import { PlatformName } from "types"
import BaseOAuthSelectButton from "./BaseOAuthSelectButton"

type Props = {
  onSelection: (platform: PlatformName) => void
}

const GitHubSelectButton = ({ onSelection }: Props) => (
  <BaseOAuthSelectButton
    scope="repo,read:user"
    buttonText="Select repo"
    colorScheme="GITHUB"
    onSelection={onSelection}
    platform="GITHUB"
  />
)

export default GitHubSelectButton
