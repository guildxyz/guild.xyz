import EditRewardAvailibilityMenuItem from "components/[guild]/AccessHub/components/EditRewardAvailibilityMenuItem"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import PlatformCardMenu from "../../components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"

type Props = {
  platformGuildId: string
}

const ContractCallCardMenu = ({ platformGuildId }: Props): JSX.Element => (
  <PlatformCardMenu>
    <EditRewardAvailibilityMenuItem platformGuildId={platformGuildId} />
    <RemovePlatformMenuItem platformGuildId={platformGuildId} />
  </PlatformCardMenu>
)

export default ContractCallCardMenu
