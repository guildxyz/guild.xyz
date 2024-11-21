"use client";

import { Button } from "@/components/ui/Button";
import { env } from "@/lib/env";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GuildCard } from "./GuildCard";

export const InfiniteScrollGuilds = () => {
  const fetchGuilds = async ({ pageParam }: { pageParam: number }) =>
    (
      await fetch(
        `${env.NEXT_PUBLIC_API}/guild/search?page=${pageParam}&pageSize=24&sortBy=name&reverse=false&search=`,
      )
    ).json() as Promise<PaginatedResponse<Guild>>;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["guilds"],
      queryFn: fetchGuilds,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.page + 1,
    });

  const guilds = data?.pages.flatMap((page) => page.items);

  return (
    <section className="grid gap-2">
      <h2 className="font-bold text-lg">Explore guilds</h2>
      {guilds && guilds.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guilds.map((guild) => (
            <GuildCard key={guild.id} guild={guild} />
          ))}
        </div>
      ) : (
        <p>Couldn&apos;t fetch guilds</p>
      )}

      <Button
        className="mt-8"
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
            ? "Load More"
            : "No More Data"}
      </Button>
    </section>
  );
};
