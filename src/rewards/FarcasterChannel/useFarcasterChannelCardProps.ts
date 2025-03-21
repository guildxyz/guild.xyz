import { CardPropsHook } from "rewards/types"
import { GuildPlatformWithOptionalId } from "types"

const useFarcasterChannelCardProps: CardPropsHook = (
  guildPlatform: GuildPlatformWithOptionalId
) => ({
  type: "FARCASTER_CHANNEL",
  name: guildPlatform.platformGuildData?.name ?? "Unknown channel",
  image: guildPlatform.platformGuildData?.imageUrl,
})

export default useFarcasterChannelCardProps
