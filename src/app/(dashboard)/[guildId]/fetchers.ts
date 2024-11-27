import { env } from "@/lib/env";
import type { Guild } from "@/lib/schemas/guild";
import { unstable_cache } from "next/cache";

// TODO: `unstable_cache` is deprecated, we should use the `"use cache"` directive instead
export const getGuild = unstable_cache(async (urlName: string) => {
  const res = await fetch(`${env.NEXT_PUBLIC_API}/guild/urlName/${urlName}`);
  const data: Guild = await res.json();
  return data;
});
