"use client";

import { guildOptions } from "@/lib/options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useGuild = (urlName?: string) => {
  const { guildUrlName: urlNameFromHook } = useParams<{
    guildUrlName: string;
  }>();

  const guildIdLike = urlName ?? urlNameFromHook;

  return useSuspenseQuery(guildOptions({ guildIdLike }));
};
