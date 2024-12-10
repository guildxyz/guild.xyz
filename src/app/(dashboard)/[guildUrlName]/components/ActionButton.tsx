import { guildOptions, userOptions } from "@/lib/options";
import { useQuery } from "@tanstack/react-query";
import { useGuildUrlName } from "../hooks/useGuildUrlName";
import { JoinGuild } from "./JoinGuild";
import { LeaveGuild } from "./LeaveGuild";

export const ActionButton = () => {
  const guildUrlName = useGuildUrlName();
  const user = useQuery(userOptions());
  const guild = useQuery(guildOptions({ guildIdLike: guildUrlName }));

  if (!guild.data) {
    throw new Error("Failed to fetch guild");
  }

  const isJoined = !!user.data?.guilds?.some(
    ({ guildId }) => guildId === guild.data.id,
  );

  return isJoined ? <LeaveGuild /> : <JoinGuild />;
};
