import { PropsWithChildren } from "react"
import { useWatch } from "react-hook-form"
import rewards from "rewards"
import RewardPreview from "./RewardPreview"

const PoapPreview = ({ children }: PropsWithChildren): JSX.Element => {
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
