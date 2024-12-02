"use server";

import { fetcherWithAuth } from "@/actions/auth";
import { env } from "@/lib/env";
import { fetcher } from "@/lib/fetcher";
import type { Schemas } from "@guildxyz/types";

export const joinGuild = async ({ guildId }: { guildId: string }) => {
  // the response type might not be suitable for this fetcher
  return fetcherWithAuth(`${env.NEXT_PUBLIC_API}/guild/${guildId}/join`, {
    method: "POST",
  });
};

export const leaveGuild = async ({ guildId }: { guildId: string }) => {
  return fetcherWithAuth(`${env.NEXT_PUBLIC_API}/guild/${guildId}/leave`, {
    method: "POST",
  });
};

export const getGuild = async ({ guildId }: { guildId: string }) => {
  return fetcher<Schemas["GuildFull"]>(
    `${env.NEXT_PUBLIC_API}/guild/id/${guildId}`,
  );
};

export const getPages = async ({ guildId }: { guildId: string }) => {
  const guild = await getGuild({ guildId });
  return fetcher<Schemas["PageFull"][]>(`${env.NEXT_PUBLIC_API}/page/batch`, {
    method: "POST",
    body: JSON.stringify({ ids: guild.pages?.map((p) => p.pageId!) ?? [] }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

//export const getUser = async () => {
//  return fetcherWithAuth<Schemas["UserFull"]>(`${env.NEXT_PUBLIC_API}/user`);
//};
