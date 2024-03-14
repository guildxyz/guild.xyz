import rewards from "platforms/rewards"
import { useWatch } from "react-hook-form"
import RewardPreview from "./RewardPreview"

const PoapPreview = ({ children }): JSX.Element => {
  const name = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData.name",
  })
  const imageUrl = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData.imageUrl",
  })

  return (
    <RewardPreview
      type="POAP"
      name={name}
      image={imageUrl ? `${imageUrl}?size=small` : rewards.POAP.imageUrl}
    >
      {children}
    </RewardPreview>
  )
}

export default PoapPreview
