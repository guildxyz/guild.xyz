import { env } from "@/lib/env";
import { fetcher } from "@/lib/fetcher";
import type { PaginatedResponse } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";

export const getGuild = async (urlName: string) => {
  return await fetcher<Schemas["GuildFull"]>(
    `${env.NEXT_PUBLIC_API}/guild/urlName/${urlName}`,
    {
      next: {
        tags: [`guild-${urlName}`],
      },
    },
  );
};

export const getPages = async (guildId: string) => {
  return (
    await fetcher<PaginatedResponse<Schemas["PageFull"]>>(
      `${env.NEXT_PUBLIC_API}/page/search?customQuery=@guildId:{${guildId}}&pageSize=${Number.MAX_SAFE_INTEGER}`,
      {
        next: {
          tags: [`page-${guildId}`],
          revalidate: 3600,
        },
      },
    )
  ).items;
};
