import { CREATE_NEW_OPTION } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/ExistingPointsTypeSelect"
import useGuildPlatform from "components/[guild]/hooks/useGuildPlatform"
import { useWatch } from "react-hook-form"
import RewardPreview from "./RewardPreview"

const PointsPreview = (): JSX.Element => {
  const guildPlatformId = useWatch({
    name: "rolePlatforms.0.guildPlatformId",
  })
  const platformGuildData = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData",
  })
  const amount = useWatch({
    name: "rolePlatforms.0.platformRoleData.score",
  })

  const { guildPlatform } = useGuildPlatform(guildPlatformId)
  const { name, imageUrl } =
    guildPlatformId && guildPlatformId !== CREATE_NEW_OPTION
      ? (guildPlatform.platformGuildData ?? {})
      : (platformGuildData ?? {})

  return (
    <RewardPreview
      type="POINTS"
      name={`Get ${amount} ${name || "points"}`}
      image={imageUrl}
    />
  )
}

export default PointsPreview
