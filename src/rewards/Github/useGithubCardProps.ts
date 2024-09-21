import { CardPropsHook } from "rewards/types"
import { GuildPlatformWithOptionalId } from "types"

const useGithubCardProps: CardPropsHook = (
  guildPlatform: GuildPlatformWithOptionalId
) => ({
  type: "GITHUB",
  name: decodeURIComponent(guildPlatform.platformGuildId),
  link: `https://github.com/${decodeURIComponent(guildPlatform.platformGuildId)}`,
})

export default useGithubCardProps
