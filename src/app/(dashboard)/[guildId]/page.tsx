import type { DynamicRoute } from "@/lib/types";
import GuildPage from "./[roleGroupId]/page";

const DefaultGuildPage = async ({
  params,
}: DynamicRoute<{ guildId: string }>) => {
  const { guildId: urlName } = await params;
  //const guild = await getGuild(urlName);
  //return `Default guild page - ${guild.name}`;
  return <GuildPage params={{ guildId: urlName, roleGroupId: "" }} />;
};

export default DefaultGuildPage;
