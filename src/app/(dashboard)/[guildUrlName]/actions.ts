"use server";

import { fetchGuildApiAuthData, fetchGuildApiData } from "@/lib/fetchGuildApi";
import type { Schemas } from "@guildxyz/types";

export const joinGuild = async ({ guildId }: { guildId: string }) => {
  // the response type might not be suitable for this fetcher
  return fetchGuildApiAuthData(`guild/${guildId}/join`, {
    method: "POST",
  });
};

export const leaveGuild = async ({ guildId }: { guildId: string }) => {
  return fetchGuildApiAuthData(`guild/${guildId}/leave`, {
    method: "POST",
  });
};

export const getGuild = async ({ guildId }: { guildId: string }) => {
  return fetchGuildApiData<Schemas["GuildFull"]>(`guild/id/${guildId}`);
};

export const getPages = async ({ guildId }: { guildId: string }) => {
  const guild = await getGuild({ guildId });
  return fetchGuildApiData<Schemas["PageFull"][]>("page/batch", {
    method: "POST",
    body: JSON.stringify({ ids: guild.pages?.map((p) => p.pageId!) ?? [] }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
