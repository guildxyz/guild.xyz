"use client"

import { useYourGuilds } from "@/hooks/useYourGuilds"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { GuildBase } from "types"
import {
  GuildCardSkeleton,
  GuildCardWithLink,
} from "../../../v2/components/GuildCard"

export const YourGuilds = () => {
  const { data: usersGuilds, isLoading: isGuildsLoading } = useYourGuilds()

  return (
    <section className="mt-1 mb-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {isGuildsLoading || !usersGuilds
        ? Array.from({ length: 6 }, (_, i) => <GuildCardSkeleton key={i} />)
        : usersGuilds.map((guild) => (
            <GuildCardWithLink guildData={guild} key={guild.id} />
          ))}
    </section>
  )
}

export { useYourGuilds }
