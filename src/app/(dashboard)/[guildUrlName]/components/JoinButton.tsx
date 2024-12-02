"use client";

import { Button } from "@/components/ui/Button";
import type { Guild } from "@/lib/schemas/guild";
import type { Schemas } from "@guildxyz/types";
import { joinGuild, leaveGuild } from "../actions";

export const JoinButton = ({
  guild,
}: { guild: Guild; user: Schemas["UserFull"] }) => {
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
