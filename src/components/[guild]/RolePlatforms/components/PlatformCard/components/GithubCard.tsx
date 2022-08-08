import { PropsWithChildren } from "react"
import { GuildPlatform } from "types"
import PlatformCard from "../PlatformCard"

type Props = {
  guildPlatform: GuildPlatform
  cornerButton: JSX.Element
}

const GithubCard = ({
  guildPlatform,
  cornerButton,
  children,
}: PropsWithChildren<Props>) => (
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
