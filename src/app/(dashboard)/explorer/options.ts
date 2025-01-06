import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { fetchAssociatedGuilds, fetchGuildSearch } from "./fetchers";

export const associatedGuildsOption = ({ userId }: { userId?: string }) => {
  return queryOptions({
    queryKey: ["associatedGuilds"],
    queryFn: () => fetchAssociatedGuilds(userId!),
    select: (data) => data.items,
    enabled: !!userId,
  });
};

export const guildSearchOptions = ({ search = "" }: { search?: string }) => {
  return infiniteQueryOptions({
    queryKey: ["guilds", search],
    queryFn: ({ pageParam }) => fetchGuildSearch({ search: search, pageParam }),
    initialPageParam: 1,
    enabled: search !== undefined,
    staleTime: 60 * 1000,
    getNextPageParam: (lastPage) =>
      lastPage.total / lastPage.pageSize <= lastPage.page
        ? undefined
        : lastPage.page + 1,
  });
};
