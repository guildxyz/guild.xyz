import { env } from "@/lib/env";
import { PAGE_SIZE } from "./constants";

export const getGuildSearch =
  (search = "") =>
  async ({ pageParam }: { pageParam: number }) => {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API}/guild/search?page=${pageParam}&pageSize=${PAGE_SIZE}&search=${search}`,
    );
    const json = await res.json();

    if (json.error) throw new Error(json.error);

    return json as PaginatedResponse<Guild>;
  };
