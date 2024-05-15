import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import EditNftMenuItem from "./components/EditNftMenuItem"

type Props = {
  platformGuildId: string
}

const ContractCallCardMenu = ({ platformGuildId }: Props): JSX.Element => (
  <PlatformCardMenu>
    <EditNftMenuItem platformGuildId={platformGuildId} />
    <RemovePlatformMenuItem platformGuildId={platformGuildId} />
  </PlatformCardMenu>
)

export default ContractCallCardMenu
