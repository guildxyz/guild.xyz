import rewards from "platforms/rewards"
import { useWatch } from "react-hook-form"
import RewardPreview from "./RewardPreview"

const GatherPreview = () => {
  const platformGuildData = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData",
  })

  return (
    <RewardPreview
      type="GATHER_TOWN"
      name={`Access space: ${platformGuildData?.name}`}
      image={rewards.GATHER_TOWN.imageUrl}
    />
  )
}

export default GatherPreview
