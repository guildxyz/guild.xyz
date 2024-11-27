"use server";
import { revalidateTag } from "next/cache";

export const revalidateRoleGroups = async (guildId: string) => {
  revalidateTag(`role-groups-${guildId}`);
};
