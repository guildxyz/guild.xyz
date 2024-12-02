import type { DynamicRoute } from "@/lib/types";
import GuildPage from "./[roleGroupUrlName]/page";

const DefaultGuildPage = async ({
  params,
}: DynamicRoute<{ guildUrlName: string }>) => {
  return <GuildPage params={{ ...(await params), roleGroupUrlName: "" }} />;
};

export default DefaultGuildPage;
