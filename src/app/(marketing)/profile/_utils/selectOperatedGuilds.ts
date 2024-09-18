import { GuildBase } from "types"

export const selectOperatedGuilds = ({
  guilds,
}: { guilds: GuildBase[] }): GuildBase[] => {
  return guilds
    .filter((guild) => guild.isAdmin)
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 2)
}
