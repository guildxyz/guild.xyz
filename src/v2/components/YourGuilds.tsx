"use client"

import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { GuildBase } from "types"
import { GuildCardSkeleton, GuildCardWithLink } from "./GuildCard"

const useYourGuilds = () =>
  useSWRWithOptionalAuth<GuildBase[]>(
    `/v2/guilds?yours=true`,
    undefined,
    false,
    true
  )

export const YourGuilds = () => {
  const { data: usersGuilds, isLoading: isGuildsLoading } = useYourGuilds()


  return (
    <section className="mb-16 mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {isGuildsLoading || !usersGuilds
        ? Array.from({ length: 6 }, (_, i) => <GuildCardSkeleton key={i} />)
        : usersGuilds.map((guild) => (
          <GuildCardWithLink guildData={guild} key={guild.id} />
        ))}
    </section>
  )
}

export { useYourGuilds }
