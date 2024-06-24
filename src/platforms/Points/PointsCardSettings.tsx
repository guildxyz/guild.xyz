import SetPointsAmount from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/SetPointsAmount"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"

const PointsCardSettings = () => {
  const { guildPlatform, dynamicAmount } = useRolePlatform()
  const { name, imageUrl } = guildPlatform.platformGuildData

  return (
    <SetPointsAmount
      {...{ name, imageUrl }}
      defaultDynamicAmount={!!dynamicAmount}
    />
  )
}

export default PointsCardSettings
