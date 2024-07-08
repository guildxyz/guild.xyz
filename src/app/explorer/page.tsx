"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { Button } from "@/components/ui/Button"
import { Plus } from "@phosphor-icons/react"
import useIsStuck from "hooks/useIsStuck"
import { Suspense, useEffect } from "react"
import useScrollspy from "hooks/useScrollSpy"
import { GuildInfiniteScroll } from "@/components/GuildInfiniteScroll"
import { GuildSearchBar } from "@/components/GuildSeachBar"
import { ActiveSection } from "./types"
import { Anchor } from "@/components/ui/Anchor"
import { Layout } from "@/components/Layout"
import {
  isNavStuckAtom,
  isSeachStuckAtom,
  activeSectionAtom,
  guildQueryAtom,
} from "./atoms"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { YourGuilds } from "@/components/YourGuilds"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"

const HeaderBackground = () => {
  const isNavStuck = useAtomValue(isNavStuckAtom)
  const isSearchStuck = useAtomValue(isSeachStuckAtom)

  return (
    <div
      className="fixed inset-x-0 top-0 z-10 h-40 -translate-y-40 border-b border-border bg-gradient-to-b from-background to-card/30 backdrop-blur backdrop-saturate-150 duration-75 data-[nav-stuck='true']:-translate-y-24 data-[nav-stuck='true']:data-[search-stuck='true']:translate-y-0 motion-safe:transition-transform sm:h-28 sm:-translate-y-28 sm:data-[nav-stuck='true']:-translate-y-12"
      data-nav-stuck={isNavStuck}
      data-search-stuck={isSearchStuck}
    />
  )
}

const Nav = () => {
  const isNavStuck = useAtomValue(isNavStuckAtom)
  const isSearchStuck = useAtomValue(isSeachStuckAtom)
  const [activeSection, setActiveSection] = useAtom(activeSectionAtom)
  const spyActiveSection = useScrollspy(Object.values(ActiveSection), 100)
  useEffect(() => {
    if (!spyActiveSection) return
    setActiveSection(spyActiveSection as ActiveSection)
  }, [spyActiveSection, setActiveSection])

  return (
    <ToggleGroup
      type="single"
      className="space-x-2"
      size={isSearchStuck ? "sm" : "lg"}
      variant={isNavStuck ? "default" : "mono"}
      onValueChange={(value) => value && setActiveSection(value as ActiveSection)}
      value={activeSection}
    >
      <ToggleGroupItem value={ActiveSection.YourGuilds} asChild>
        <a href={`#${ActiveSection.YourGuilds}`}>Your guilds</a>
      </ToggleGroupItem>
      <ToggleGroupItem value={ActiveSection.ExploreGuilds} asChild>
        <a href={`#${ActiveSection.ExploreGuilds}`}>Explore guilds</a>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

const Page = () => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const setIsNavStuck = useSetAtom(isNavStuckAtom)
  const setIsSearchStuck = useSetAtom(isSeachStuckAtom)
  const { ref: navToggleRef } = useIsStuck(setIsNavStuck)
  const { ref: searchRef } = useIsStuck(setIsSearchStuck)

  return (
    <>
      <HeaderBackground />
      <Layout.Root>
        <Layout.Header>
          <div id={ActiveSection.YourGuilds}>
            <Layout.Headline title="Guildhall" />
          </div>
          <Layout.Banner />
        </Layout.Header>
        <Layout.Main>
          <div className="sticky top-0 z-10 my-1 py-2" ref={navToggleRef}>
            <div className="relative flex items-start justify-between">
              <Nav />
              {isWeb3Connected && (
                <Button variant="ghost" className="space-x-2">
                  <Plus />
                  <span>Create guild</span>
                </Button>
              )}
            </div>
          </div>
          <YourGuilds />
          <section id={ActiveSection.ExploreGuilds}>
            <h2 className="text-lg font-bold tracking-tight">
              Explore verified guilds
            </h2>
            <div className="sticky top-10 z-10" ref={searchRef}>
              <Suspense>
                <GuildSearchBar queryAtom={guildQueryAtom} />
              </Suspense>
            </div>
            <GuildInfiniteScroll queryAtom={guildQueryAtom} />
          </section>
        </Layout.Main>
        <Layout.Footer>
          <p className="my-8 text-center text-sm text-muted-foreground">
            This website is{" "}
            <Anchor
              href="https://github.com/guildxyz/guild.xyz"
              target="_blank"
              showExternal
            >
              open source
            </Anchor>
            , and built on the{" "}
            <Anchor
              target="_blank"
              href="https://www.npmjs.com/package/@guildxyz/sdk"
              showExternal
            >
              Guild SDK
            </Anchor>
          </p>
        </Layout.Footer>
      </Layout.Root>
    </>
  )
}

export default Page
