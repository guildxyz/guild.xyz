import type { DynamicRoute } from "@/lib/types";
import GuildPage from "./[pageUrlName]/page";

const DefaultGuildPage = async ({
  params,
}: DynamicRoute<{ guildUrlName: string }>) => {
  return <GuildPage params={{ ...(await params), pageUrlName: "" }} />;
};

export default DefaultGuildPage;
