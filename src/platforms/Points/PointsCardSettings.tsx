import SetPointsAmount from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/SetPointsAmount"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"

const PointsCardSettings = () => {
  const { guildPlatform, index, dynamicAmount } = useRolePlatform()
  const { name, imageUrl } = guildPlatform.platformGuildData

  return (
    <SetPointsAmount
      {...{ name, imageUrl }}
      baseFieldPath={`rolePlatforms.${index}`}
      defaultDynamicAmount={!!dynamicAmount}
      optionsDisabled="Please add as a new reward to switch amount type"
    />
  )
}

export default PointsCardSettings
