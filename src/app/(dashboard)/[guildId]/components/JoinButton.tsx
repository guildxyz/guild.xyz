"use client";

import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { env } from "@/lib/env";
import { fetcher } from "@/lib/fetcher";
import { getCookie } from "@/lib/getCookie";
import type { Guild } from "@/lib/schemas/guild";
import { tokenSchema } from "@/lib/schemas/user";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

const joinGuild = ({ guildId }: { guildId: string }) => {
  const token = getCookie(GUILD_AUTH_COOKIE_NAME);
  return (
    token &&
    fetcher(`${env.NEXT_PUBLIC_API}/guild/${guildId}/join`, {
      method: "POST",
      headers: {
        "X-Auth-Token": token,
      },
    })
  );
};

const leaveGuild = ({ guildId }: { guildId: string }) => {
  const token = getCookie(GUILD_AUTH_COOKIE_NAME);
  return (
    token &&
    fetcher(`${env.NEXT_PUBLIC_API}/guild/${guildId}/leave`, {
      method: "POST",
      headers: {
        "X-Auth-Token": token,
      },
    })
  );
};

export const JoinButton = ({ guild }: { guild: Guild }) => {
  const token = getCookie(GUILD_AUTH_COOKIE_NAME);
  const userId = token && tokenSchema.parse(jwtDecode(token)).userId;

  const user = useQuery<object>({
    queryKey: ["user", userId],
    queryFn: () => fetcher(`${env.NEXT_PUBLIC_API}/user/id/${userId}`),
    enabled: !!userId,
  });

  if (!user.data) {
    return <Skeleton className="h-[44px] w-[108px] rounded-lg" />;
  }

  // @ts-ignore
  const isJoined = !!user.data.guilds?.some(
    // @ts-ignore
    ({ guildId }) => guildId === guild.id,
  );

  return isJoined ? (
    <Button
      colorScheme="destructive"
      className="rounded-2xl"
      onClick={() => {
        leaveGuild({ guildId: guild.id });
      }}
    >
      Leave Guild
    </Button>
  ) : (
    <Button
      colorScheme="success"
      className="rounded-2xl"
      onClick={() => {
        joinGuild({ guildId: guild.id });
      }}
    >
      Join Guild
    </Button>
  );
};
