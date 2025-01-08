import {
  type QueryKey,
  type UnusedSkipTokenInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useIntersection } from "foxact/use-intersection";
import { useEffect } from "react";

export const useInfiniteQueryWithIntersection = <
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
  TPageParam,
>(config: {
  infiniteQueryOptions: UnusedSkipTokenInfiniteOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >;
  intersectionOptions?: Parameters<typeof useIntersection>[0];
}) => {
  const infiniteQuery = useInfiniteQuery(config.infiniteQueryOptions);

  const { isFetchingNextPage, hasNextPage, fetchNextPage } = infiniteQuery;

  const [setIntersection, isIntersected, resetIsIntersecting] = useIntersection(
    config.intersectionOptions ?? {},
  );

  useEffect(() => {
    if (isFetchingNextPage) {
      resetIsIntersecting();
      return;
    }

    if (isIntersected && hasNextPage) {
      fetchNextPage();
    }
  }, [
    isFetchingNextPage,
    isIntersected,
    hasNextPage,
    fetchNextPage,
    resetIsIntersecting,
  ]);

  return {
    setIntersection,
    infiniteQuery,
  };
};
