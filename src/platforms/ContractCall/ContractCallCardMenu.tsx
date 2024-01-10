import EditRewardAvailabilityMenuItem from "components/[guild]/AccessHub/components/EditRewardAvailabilityMenuItem"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import PlatformCardMenu from "../../components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"

type Props = {
  platformGuildId: string
}

const ContractCallCardMenu = ({ platformGuildId }: Props): JSX.Element => (
  <PlatformCardMenu>
    <EditRewardAvailabilityMenuItem platformGuildId={platformGuildId} />
    <RemovePlatformMenuItem platformGuildId={platformGuildId} />
  </PlatformCardMenu>
)

export default ContractCallCardMenu
