"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { env } from "@/lib/env";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from "foxact/use-intersection";
import { useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { searchAtom } from "../atoms";
import { GuildCard } from "./GuildCard";

const pageSize = 24;

export const InfiniteScrollGuilds = () => {
  const search = useAtomValue(searchAtom);
  const fetchGuilds = useCallback(
    async ({ pageParam }: { pageParam: number }) =>
      (
        await fetch(
          `${env.NEXT_PUBLIC_API}/guild/search?page=${pageParam}&pageSize=${pageSize}&search=${search}`,
        )
      ).json() as Promise<PaginatedResponse<Guild>>,
    [search],
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["guilds", search],
      queryFn: fetchGuilds,
      initialPageParam: 1,
      enabled: search !== undefined,
      getNextPageParam: (lastPage) =>
        lastPage.total / lastPage.pageSize <= lastPage.page
          ? undefined
          : lastPage.page + 1,
    });

  const [setIntersection, isIntersected, resetIsIntersected] = useIntersection({
    rootMargin: "700px",
  });

  useEffect(() => {
    if (isFetchingNextPage) return;
    if (isIntersected && hasNextPage) {
      fetchNextPage();
    }
    resetIsIntersected();
  }, [isIntersected, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const guilds = data?.pages.flatMap((page) => page.items);

  return (
    <section className="grid gap-2">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 33 }, (_, i) => (
              <Card key={i}>
                <Skeleton className="size-full h-[114px]" />
              </Card>
            ))
          : guilds?.map((guild) => <GuildCard key={guild.id} guild={guild} />)}
      </div>

      <div
        ref={(element: HTMLDivElement | null) => {
          setIntersection(element);
        }}
        aria-hidden
      />
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
