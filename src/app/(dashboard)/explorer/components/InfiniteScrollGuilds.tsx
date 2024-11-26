"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from "foxact/use-intersection";
import { useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { searchAtom } from "../atoms";
import { PAGE_SIZE } from "../constants";
import { getGuildSearch } from "../fetchers";
import { GuildCard, GuildCardSkeleton } from "./GuildCard";

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

  let statusResponse: string | undefined;
  if (isFetchingNextPage) {
    statusResponse = "Loading more...";
  } else if (!hasNextPage && guilds.length) {
    statusResponse = "No More Data";
  } else if (search && !isLoading) {
    statusResponse = `No results for "${search}"`;
  } else {
    statusResponse = "Couldn't load guilds";
  }

  return (
    <section className="grid gap-2">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? // biome-ignore lint: it's safe to use index as key in this case
            [...Array(PAGE_SIZE)].map((_, i) => <GuildCardSkeleton key={i} />)
          : guilds.map((guild, _i) => (
              <GuildCard key={guild.urlName} guild={guild} />
            ))}
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
      <p className="mt-6 text-center text-foreground-secondary">
        {statusResponse}
      </p>
    </section>
  );
};
