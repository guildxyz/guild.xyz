import { PlatformCardProps } from ".."
import PlatformCard from "../PlatformCard"

const GithubCard = ({
  guildPlatform,
  cornerButton,
  children,
}: PlatformCardProps) => (
  <PlatformCard
    type="GITHUB"
    // imageUrl={"/default_github_icon.png"}
    name={decodeURIComponent(guildPlatform.platformGuildId)}
    cornerButton={cornerButton}
    link={`https://github.com/${decodeURIComponent(guildPlatform.platformGuildId)}`}
  >
    {children}
  </PlatformCard>
)

export default GithubCard
