"use client";

import { Button } from "@/components/ui/Button";
import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { env } from "@/lib/env";
import { fetcher } from "@/lib/fetcher";
import { getCookie } from "@/lib/getCookie";
import type { Guild } from "@/lib/schemas/guild";

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

export const JoinButton = ({ guild }: { guild: Guild }) => {
  return (
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
