"use server";

import { fetcherWithAuth } from "@/actions/auth";
import { env } from "@/lib/env";
import { fetcher } from "@/lib/fetcher";

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

export const getGuild = async () => {
  return fetcher(`${env.NEXT_PUBLIC_API}/guild`);
};

export const getUser = async () => {
  return fetcherWithAuth(`${env.NEXT_PUBLIC_API}/guild`);
};
