import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { fetchAssociatedGuilds, fetchGuildSearch } from "./fetchers";

export const associatedGuildsOption = () => {
  return queryOptions({
    queryKey: ["associatedGuilds"],
    queryFn: () => fetchAssociatedGuilds(),
    select: (data) => data.items,
  });
};

export const guildSearchOptions = ({ search = "" }: { search?: string }) => {
  return infiniteQueryOptions({
    queryKey: ["guilds", search],
    queryFn: ({ pageParam }) => fetchGuildSearch({ search: search, pageParam }),
    initialPageParam: 1,
    enabled: search !== undefined,
    getNextPageParam: (lastPage) =>
      lastPage.total / lastPage.pageSize <= lastPage.page
        ? undefined
        : lastPage.page + 1,
  });
};
