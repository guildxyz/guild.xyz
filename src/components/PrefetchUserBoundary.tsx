import { getQueryClient } from "@/lib/getQueryClient";
import { userOptions } from "@/lib/options";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

export const PrefetchUserBoundary = async ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(userOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};
