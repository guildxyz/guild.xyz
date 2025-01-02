"use client";

import { Button } from "@/components/ui/Button";
import { useUser } from "@/hooks/useUser";
import { useGuild } from "../hooks/useGuild";
import { JoinGuild } from "./JoinGuild";
import { LeaveGuild } from "./LeaveGuild";

export const ActionButton = () => {
  const user = useUser();
  const guild = useGuild();

  if (!guild.data) {
    throw new Error("Failed to fetch guild");
  }

  const isJoined = !!user.data?.guilds?.some(
    ({ guildId }) => guildId === guild.data.id,
  );

  return isJoined ? <LeaveGuild /> : <JoinGuild />;
};

export const ActionButtonSkeleton = () => (
  <Button isLoading loadingText="Loading">
    Join guild
  </Button>
);
