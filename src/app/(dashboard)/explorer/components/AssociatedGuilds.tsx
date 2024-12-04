"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { associatedGuildsOption } from "../options";
import { CreateGuildLink } from "./CreateGuildLink";
import { GuildCard, GuildCardSkeleton } from "./GuildCard";

export const AssociatedGuilds = () => {
  const { data: associatedGuilds } = useSuspenseQuery(associatedGuildsOption());

  return associatedGuilds.length > 0 ? (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {associatedGuilds.map((guild) => (
        <GuildCard key={guild.id} guild={guild} />
      ))}
    </div>
  ) : (
    <div className="flex items-center gap-4 rounded-2xl bg-card px-5 py-6">
      <img src="/images/robot.svg" alt="Guild Robot" className="size-8" />

      <p className="font-semibold">
        You&apos;re not a member of any guilds yet. Explore and join some below,
        or create your own!
      </p>

      <CreateGuildLink className="ml-auto" />
    </div>
  );
};

export const AssociatedGuildsSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <GuildCardSkeleton key={i} />
      ))}
    </div>
  );
};
