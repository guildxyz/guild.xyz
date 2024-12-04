import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { associatedGuildsOption, guildSearchOptions } from "./options";

const ExplorerLayout = async ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    guildSearchOptions({}),
    //queryFn: () => fetchGuildSearch({ search: "", pageParam: 1 }),
  );
  void queryClient.prefetchQuery(associatedGuildsOption());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};

export default ExplorerLayout;
