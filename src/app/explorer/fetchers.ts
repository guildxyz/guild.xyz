import { env } from "@/lib/env";
import { PAGE_SIZE } from "./constants";

export const getGuildSearch =
  (search = "") =>
  async ({ pageParam }: { pageParam: number }) => {
    return (
      await fetch(
        `${env.NEXT_PUBLIC_API}/guild/search?page=${pageParam}&pageSize=${PAGE_SIZE}&search=${search}`,
      )
    ).json() as Promise<PaginatedResponse<Guild>>;
  };
