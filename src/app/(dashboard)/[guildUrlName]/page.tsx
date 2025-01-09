import type { DynamicRoute } from "@/lib/types";
import GuildPage from "./[pageUrlName]/page";

// TODO: we could use catch-all route here?
const DefaultGuildPage = async (
  props: DynamicRoute<{ guildUrlName: string; pageUrlName: string }>,
) => {
  return <GuildPage {...props} />;
};

export default DefaultGuildPage;
