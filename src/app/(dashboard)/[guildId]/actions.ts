"use server";
import { fetcherWithAuth } from "@/actions/auth";
import { env } from "@/lib/env";
import { revalidateTag } from "next/cache";

export const revalidateRoleGroups = async (guildId: string) => {
  revalidateTag(`role-groups-${guildId}`);
};

export const joinGuild = async ({ guildId }: { guildId: string }) => {
  return fetcherWithAuth(`${env.NEXT_PUBLIC_API}/guild/${guildId}/join`, {
    method: "POST",
  });
};

export const leaveGuild = async ({ guildId }: { guildId: string }) => {
  return fetcherWithAuth(`${env.NEXT_PUBLIC_API}/guild/${guildId}/leave`, {
    method: "POST",
  });
};
