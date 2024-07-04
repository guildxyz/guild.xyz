import { CardPropsHook } from "rewards/types"
import { GuildPlatformWithOptionalId, PlatformName } from "types"

const useGithubCardProps: CardPropsHook = (
  guildPlatform: GuildPlatformWithOptionalId
) => ({
  type: "GITHUB" as PlatformName,
  name: decodeURIComponent(guildPlatform.platformGuildId),
  link: `https://github.com/${decodeURIComponent(guildPlatform.platformGuildId)}`,
})

export default useGithubCardProps
