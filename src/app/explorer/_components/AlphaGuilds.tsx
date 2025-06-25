import { GuildCardSkeleton, GuildCardWithLink } from "@/components/GuildCard"
import { useAlphaGuilds } from "../hooks/useAlphaGuilds"

export const AlphaGuilds = () => {
  const { data } = useAlphaGuilds()

  return (
    <section className="mb-8 flex flex-col gap-5">
      <h2 className="font-bold text-lg tracking-tight">Explore alpha guilds</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {!data ? (
          Array.from({ length: 6 }, (_, i) => <GuildCardSkeleton key={i} />)
        ) : data.length < 1 ? (
          <p className="sm:col-span-2 lg:col-span-3">Couldn't load alpha guilds</p>
        ) : (
          data.map((guild) => (
            <GuildCardWithLink
              key={guild.id}
              guildData={{
                id: 0,
                hideFromExplorer: false,
                imageUrl: guild.logoUrl ?? "",
                memberCount: guild.memberCount,
                name: guild.name,
                urlName: guild.urlName,
                rolesCount: 0,
                tags: [],
              }}
              isAlpha
            />
          ))
        )}
      </div>
    </section>
  )
}
