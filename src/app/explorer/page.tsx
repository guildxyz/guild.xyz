"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { Button } from "@/components/ui/Button"
import { Plus, SignIn, } from "@phosphor-icons/react"
import Robot from "/public/landing/robot.svg"
import { Header } from "@/components/Header"
import { Separator } from "@/components/ui/Separator"
import useIsStuck from "hooks/useIsStuck"
import { PageBoundary } from "@/components/PageBoundary"
import { Card } from "@/components/ui/Card"
import { useEffect, useState } from "react"
import useScrollspy from "hooks/useScrollSpy"
import { GuildInfiniteScroll } from "@/components/GuildInfiniteScroll"
import Link from "next/link"
import { GuildSearchBar } from "@/components/GuildSeachBar"

enum ActiveSection {
  YourGuilds = "your-guilds",
  ExploreGuilds = "explore-guilds",
}

const Page = () => {
  const isAuthenticated = false
  const { ref: navToggleRef, isStuck: isNavStuck } = useIsStuck()
  const { ref: searchRef, isStuck: isSearchStuck } = useIsStuck()
  const [activeSection, setActiveSection] = useState<ActiveSection>(
    ActiveSection.YourGuilds
  )
  const spyActiveSection = useScrollspy(Object.values(ActiveSection), 100)
  useEffect(() => {
    if (!spyActiveSection) return
    setActiveSection(spyActiveSection as ActiveSection)
  }, [spyActiveSection])

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="fixed inset-x-0 top-0 h-40 -translate-y-40 border-b border-border bg-gradient-to-b from-background to-card/30 backdrop-blur backdrop-saturate-150 duration-75 data-[nav-stuck='true']:-translate-y-24 data-[nav-stuck='true']:data-[search-stuck='true']:translate-y-0 motion-safe:transition-transform sm:h-28 sm:-translate-y-28 sm:data-[nav-stuck='true']:-translate-y-12"
        data-nav-stuck={isNavStuck}
        data-search-stuck={isSearchStuck}
      />
      <div className="relative">
        <Header />
        <PageBoundary>
          <h1
            className="pb-14 pt-9 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"
            id={ActiveSection.YourGuilds}
          >
            Guildhall
          </h1>
        </PageBoundary>
        <div className="absolute inset-0 -bottom-28 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[hsl(240deg_4%_16%)]" />
          <div className="absolute inset-0 bg-[url('/banner.png')] bg-[auto_115%] bg-[right_top_10px] bg-no-repeat opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(240deg_2.65%_22.16%)] from-50% to-transparent" />
        </div>
      </div>
      <div>
          <main>
        <PageBoundary>
            <div className="sticky top-0 my-1 py-2" ref={navToggleRef}>
              <div className="relative flex items-start justify-between">
                <ToggleGroup
                  type="single"
                  className="space-x-2"
                  size={isSearchStuck ? "sm" : "lg"}
                  variant={isNavStuck ? "default" : "mono"}
                  onValueChange={(value) =>
                    value && setActiveSection(value as ActiveSection)
                  }
                  value={activeSection}
                >
                  <ToggleGroupItem value={ActiveSection.YourGuilds} asChild>
                    <a href={`#${ActiveSection.YourGuilds}`}>Your guilds</a>
                  </ToggleGroupItem>
                  <ToggleGroupItem value={ActiveSection.ExploreGuilds} asChild>
                    <a href={`#${ActiveSection.ExploreGuilds}`}>Explore guilds</a>
                  </ToggleGroupItem>
                </ToggleGroup>
                {isAuthenticated && (
                  <Button variant="ghost" className="space-x-2">
                    <Plus />
                    <span>Create guild</span>
                  </Button>
                )}
              </div>
            </div>
            <section>
              <Card className="my-2 mb-12 flex flex-col items-stretch justify-between gap-8 p-6 font-semibold sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <Robot className="size-8 min-w-8 text-white" />
                  <span>Sign in to view your guilds / create new ones</span>
                </div>
                <Button className="space-x-2">
                  <SignIn />
                  <span className="text-md">Sign in</span>
                </Button>
              </Card>
            </section>
            {isAuthenticated && <Separator className="mb-10" />}
            <h2 className="text-lg font-bold tracking-tight">
              Explore verified guilds
            </h2>
            <div
              className="sticky top-10"
              ref={searchRef}
              id={ActiveSection.ExploreGuilds}
            >
              <GuildSearchBar />
            </div>
            <GuildInfiniteScroll />
        </PageBoundary>
          </main>
      </div>
      <footer className="mt-auto">
        <PageBoundary>
          <p className="my-8 text-center text-sm text-muted-foreground">
            This website is{" "}
            <Link href="https://github.com/guildxyz/guild.xyz" target="_blank">
              open source
            </Link>
            , and built on the{" "}
            <Link target="_blank" href="https://www.npmjs.com/package/@guildxyz/sdk">
              Guild SDK
            </Link>
          </p>
        </PageBoundary>
      </footer>
    </div>
  )
}

export default Page
