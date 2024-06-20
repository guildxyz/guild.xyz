import SetPointsAmount from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/SetPointsAmount"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"

const PointsCardSettings = () => {
  const { guildPlatform, index = 0, dynamicAmount } = useRolePlatform()
  const { name, imageUrl } = guildPlatform.platformGuildData

  return (
    <SetPointsAmount
      {...{ name, imageUrl }}
      baseFieldPath={`rolePlatforms.${index}`}
      defaultDynamicAmount={!!dynamicAmount}
    />
  )
}

export default PointsCardSettings
