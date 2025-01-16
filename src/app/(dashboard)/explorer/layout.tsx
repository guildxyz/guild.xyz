import { getQueryClient } from "@/lib/getQueryClient";
import { userOptions } from "@/lib/options";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { associatedGuildsOption, guildSearchOptions } from "./options";

const ExplorerLayout = async ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(guildSearchOptions({}));
  const user = await queryClient
    .fetchQuery(userOptions())
    .catch(() => undefined);
  await queryClient.prefetchQuery(associatedGuildsOption({ userId: user?.id }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};

export default ExplorerLayout;
