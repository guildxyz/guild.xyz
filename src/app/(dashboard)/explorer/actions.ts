"use server";

import { env } from "@/lib/env";
import type { Guild } from "@/lib/schemas/guild";
import type { PaginatedResponse } from "@/lib/types";
import { fetcher } from "../../../lib/fetcher";
import { PAGE_SIZE } from "./constants";

export const getGuildSearch = async ({
  pageParam,
  search,
}: { pageParam: number; search: string }) => {
  return fetcher<PaginatedResponse<Guild>>(
    `${env.NEXT_PUBLIC_API}/guild/search?page=${pageParam}&pageSize=${PAGE_SIZE}&search=${search}`,
  );
};
