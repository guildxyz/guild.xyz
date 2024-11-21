"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from "foxact/use-intersection";
import { useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { searchAtom } from "../atoms";
import { PAGE_SIZE } from "../constants";
import { getGuildSearch } from "../fetchers";
import { GuildCard } from "./GuildCard";

export const InfiniteScrollGuilds = () => {
  const search = useAtomValue(searchAtom);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["guilds", search || ""],
      queryFn: getGuildSearch(search),
      initialPageParam: 1,
      staleTime: Number.POSITIVE_INFINITY,
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
    if (!isFetchingNextPage) {
      resetIsIntersected();
    }
  }, [resetIsIntersected, isFetchingNextPage]);

  useEffect(() => {
    if (isFetchingNextPage) return;
    if (isIntersected && hasNextPage) {
      fetchNextPage();
    }
  }, [isIntersected, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const guilds = data?.pages.flatMap((page) => page.items) || [];

  return (
    <section className="grid gap-2">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: PAGE_SIZE }, (_, i) => (
              <Card key={i}>
                <Skeleton className="size-full h-[114px]" />
              </Card>
            ))
          : guilds.map((guild) => <GuildCard key={guild.id} guild={guild} />)}
      </div>
      <div
        ref={useCallback(
          (element: HTMLDivElement | null) => {
            setIntersection(element);
          },
          [setIntersection],
        )}
        aria-hidden
      />
      {guilds.length === 0 &&
        !isLoading &&
        search &&
        `No results for "${search}"`}
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
