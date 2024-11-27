import { env } from "@/lib/env";
import type { Guild } from "@/lib/schemas/guild";
import type { RoleGroup } from "@/lib/schemas/roleGroup";
import type { PaginatedResponse } from "@/lib/types";

export const getGuild = async (urlName: string) => {
  const res = await fetch(`${env.NEXT_PUBLIC_API}/guild/urlName/${urlName}`, {
    next: {
      tags: [`guild-${urlName}`],
    },
  });
  const data: Guild = await res.json();
  return data;
};

export const getRoleGroups = async (guildId: string) => {
  const res = await fetch(
    `${env.NEXT_PUBLIC_API}/role-group/search?customQuery=@guildId:{${guildId}}`,
    {
      next: {
        tags: [`role-groups-${guildId}`],
      },
    },
  );
  const data: PaginatedResponse<RoleGroup> = await res.json();
  return data.items;
};
