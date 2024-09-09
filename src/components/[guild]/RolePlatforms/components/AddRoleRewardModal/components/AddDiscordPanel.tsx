import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import { useWatch } from "react-hook-form"
import { AddRewardPanelProps } from "rewards"
import { ConnectPlatformFallback } from "solutions/components/ConnectPlatformFallback"
import { PlatformGuildData, PlatformType } from "types"
import DefaultAddRewardPanelWrapper from "../DefaultAddRewardPanelWrapper"

const AddDiscordPanel = ({ onAdd }: AddRewardPanelProps) => {
  // TODO: we could somehow extract this piece of logis from here to make sure that AddDiscordPanel doesn't depend on the role form's state
  const rolePlatforms = useWatch({ name: "rolePlatforms" })

  return (
    <DefaultAddRewardPanelWrapper>
      <ConnectPlatformFallback platform="DISCORD">
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
            })
          }}
        />
      </ConnectPlatformFallback>
    </DefaultAddRewardPanelWrapper>
  )
}

export default AddDiscordPanel
