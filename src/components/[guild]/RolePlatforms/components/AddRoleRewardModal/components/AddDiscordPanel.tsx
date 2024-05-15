import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import { AddRewardPanelProps } from "platforms/rewards"
import { useWatch } from "react-hook-form"
import { PlatformGuildData, PlatformType } from "types"

const AddDiscordPanel = ({ onAdd }: AddRewardPanelProps) => {
  // TODO: we could somehow extract this piece of logis from here to make sure that AddDiscordPanel doesn't depend on the role form's state
  const rolePlatforms = useWatch({ name: "rolePlatforms" })

  return (
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
  )
}

export default AddDiscordPanel
