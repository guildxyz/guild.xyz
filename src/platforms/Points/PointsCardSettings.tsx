import SetPointsAmount from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/SetPointsAmount"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"

const PointsCardSettings = () => {
  const { guildPlatform, index } = useRolePlatform()
  const { name, imageUrl } = guildPlatform.platformGuildData

  return (
    <SetPointsAmount
      {...{ name, imageUrl }}
      fieldName={`rolePlatforms.${index}.platformRoleData.score`}
    />
  )
}

export default PointsCardSettings
