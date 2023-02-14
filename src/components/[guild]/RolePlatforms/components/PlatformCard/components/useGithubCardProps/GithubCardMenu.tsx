import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import PlatformCardMenu from "../PlatformCardMenu"

type Props = {
  platformGuildId: string
}

const GithubCardMenu = ({ platformGuildId }: Props): JSX.Element => (
  <PlatformCardMenu>
    <RemovePlatformMenuItem platformGuildId={platformGuildId} />
  </PlatformCardMenu>
)

export default GithubCardMenu
