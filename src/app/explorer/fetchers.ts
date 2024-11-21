import { env } from "@/lib/env";
import { pageSize } from "./constants";

export const getGuildSearch =
  (search = "") =>
  async ({ pageParam }: { pageParam: number }) => {
    return (
      await fetch(
        `${env.NEXT_PUBLIC_API}/guild/search?page=${pageParam}&pageSize=${pageSize}&search=${search}`,
      )
    ).json() as Promise<PaginatedResponse<Guild>>;
  };
