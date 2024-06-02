import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import { AddRewardPanelProps } from "platforms/rewards"
import { useWatch } from "react-hook-form"
import { PlatformGuildData, PlatformType } from "types"
import DefaultAddRewardPanelWrapper from "../DefaultAddRewardPanelWrapper"

const AddDiscordPanel = ({ onAdd }: AddRewardPanelProps) => {
  // TODO: we could somehow extract this piece of logis from here to make sure that AddDiscordPanel doesn't depend on the role form's state
  const rolePlatforms = useWatch({ name: "rolePlatforms" })

  return (
    <DefaultAddRewardPanelWrapper>
      <DiscordGuildSetup
        rolePlatforms={rolePlatforms}
        onSubmit={(data) => {
          onAdd({
            guildPlatform: {
              platformName: "DISCORD",
              platformId: PlatformType.DISCORD,
              platformGuildId: data?.id,
              platformGuildData: {
                name: data?.name,
                imageUrl: data?.img,
              } as PlatformGuildData["DISCORD"],
            },
            isNew: true,
            platformRoleId: null,
          })
        }}
      />
    </DefaultAddRewardPanelWrapper>
  )
}

export default AddDiscordPanel
