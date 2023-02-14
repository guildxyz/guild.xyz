import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import PlatformCardMenu from "../PlatformCardMenu"

type Props = {
  platformGuildId: string
}

const GoogleCardMenu = ({ platformGuildId }: Props): JSX.Element => (
  <PlatformCardMenu>
    <RemovePlatformMenuItem platformGuildId={platformGuildId} />
  </PlatformCardMenu>
)

export default GoogleCardMenu
