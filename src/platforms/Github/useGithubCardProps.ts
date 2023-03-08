import { GuildPlatform, PlatformName } from "types"

const useGithubCardProps = (guildPlatform: GuildPlatform) => ({
  type: "GITHUB" as PlatformName,
  name: decodeURIComponent(guildPlatform.platformGuildId),
  link: `https://github.com/${decodeURIComponent(guildPlatform.platformGuildId)}`,
})

export default useGithubCardProps
