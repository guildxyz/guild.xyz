import { getQueryClient } from "@/lib/getQueryClient";
import { pageMonoviewOptions } from "@/lib/options";
import type { DynamicRoute } from "@/lib/types";
import { Roles } from "../components/Roles";

const GuildPage = async ({
  params,
}: DynamicRoute<{ guildUrlName: string; pageUrlName: string }>) => {
  const { guildUrlName, pageUrlName } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    pageMonoviewOptions({
      guildIdLike: guildUrlName,
      pageIdLike: pageUrlName,
    }),
  );

  return <Roles />;
};

export default GuildPage;
