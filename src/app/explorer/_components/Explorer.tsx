"use client"
import { GuildSearchBar } from "app/explorer/_components/GuildSearchBar"
import { YourGuilds } from "app/explorer/_components/YourGuilds"
import useIsStuck from "hooks/useIsStuck"
import { useSetAtom } from "jotai"
import { Suspense } from "react"
import { SearchParams } from "types"
import { isSearchStuckAtom } from "../atoms"
import { ActiveSection } from "../types"
import { GuildInfiniteScroll } from "./GuildInfiniteScroll"
import { StickyBar } from "./StickyBar"

export const Explorer = ({ searchParams }: { searchParams: SearchParams }) => {
  const setIsSearchStuck = useSetAtom(isSearchStuckAtom)
  const { ref: searchRef } = useIsStuck(setIsSearchStuck)

  return (
    <>
      <StickyBar />
      <YourGuilds />

      <section id={ActiveSection.ExploreGuilds} className="flex flex-col gap-5">
        <h2 className="font-bold text-lg tracking-tight">Explore verified guilds</h2>

        <div className="sticky top-12 z-10" ref={searchRef}>
          <Suspense>
            <GuildSearchBar />
          </Suspense>
        </div>

        <GuildInfiniteScroll searchParams={searchParams} />
      </section>
    </>
  )
}
