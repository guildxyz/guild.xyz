import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { guildSearchOptions } from "./options";

const ExplorerLayout = async ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(guildSearchOptions({}));
  // await queryClient.prefetchQuery(associatedGuildsOption());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};

export default ExplorerLayout;
