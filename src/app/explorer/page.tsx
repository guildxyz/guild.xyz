"use client"

import { GuildInfiniteScroll } from "@/components/GuildInfiniteScroll"
import { GuildSearchBar } from "@/components/GuildSearchBar"
import { Layout } from "@/components/Layout"
import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { YourGuilds } from "@/components/YourGuilds"
import { Anchor } from "@/components/ui/Anchor"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { cn } from "@/lib/utils"
import { Plus } from "@phosphor-icons/react"
import { SignIn } from "@phosphor-icons/react"
import useIsStuck from "hooks/useIsStuck"
import useScrollspy from "hooks/useScrollSpy"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { Suspense, useEffect } from "react"
import Robot from "/public/landing/robot.svg"
import {
  activeSectionAtom,
  guildQueryAtom,
  isNavStuckAtom,
  isSearchStuckAtom,
} from "./atoms"
import { ActiveSection } from "./types"

const HeaderBackground = () => {
  const isNavStuck = useAtomValue(isNavStuckAtom)
  const isSearchStuck = useAtomValue(isSearchStuckAtom)

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-10 h-0 bg-background shadow-md transition-all duration-200",
        {
          "h-16": isNavStuck,
          "h-[calc(theme(space.28)-theme(space.2))] bg-gradient-to-b from-background to-card-secondary":
            isSearchStuck,
        }
      )}
    />
  )
}

const Nav = () => {
  const isNavStuck = useAtomValue(isNavStuckAtom)
  const isSearchStuck = useAtomValue(isSearchStuckAtom)
  const [activeSection, setActiveSection] = useAtom(activeSectionAtom)
  const spyActiveSection = useScrollspy(Object.values(ActiveSection), 100)
  useEffect(() => {
    if (!spyActiveSection) return
    setActiveSection(spyActiveSection as ActiveSection)
  }, [spyActiveSection, setActiveSection])

  return (
    <ToggleGroup
      type="single"
      className="gap-2"
      size={isSearchStuck ? "sm" : "lg"}
      variant={isNavStuck ? "default" : "mono"}
      onValueChange={(value) => value && setActiveSection(value as ActiveSection)}
      value={activeSection}
    >
      <ToggleGroupItem
        value={ActiveSection.YourGuilds}
        className={cn("rounded-xl transition-all", {
          "rounded-lg": isSearchStuck,
        })}
        asChild
      >
        <a href={`#${ActiveSection.YourGuilds}`}>Your guilds</a>
      </ToggleGroupItem>
      <ToggleGroupItem
        value={ActiveSection.ExploreGuilds}
        className={cn("rounded-xl transition-all", {
          "rounded-lg": isSearchStuck,
        })}
        asChild
      >
        <a href={`#${ActiveSection.ExploreGuilds}`}>Explore guilds</a>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

const CreateGuildLink = () => {
  const isNavStuck = useAtomValue(isNavStuckAtom)
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("gap-1.5", {
        "text-white": !isNavStuck,
      })}
    >
      <Plus />
      <span>Create guild</span>
    </Button>
  )
}

const StickyBar = () => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const setIsNavStuck = useSetAtom(isNavStuckAtom)
  const isSearchStuck = useAtomValue(isSearchStuckAtom)
  const { ref: navToggleRef } = useIsStuck(setIsNavStuck)

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex h-16 w-full items-center transition-all",
        {
          "h-12": isSearchStuck,
        }
      )}
      ref={navToggleRef}
    >
      <div className="relative flex w-full items-center justify-between">
        <Nav />
        {isWeb3Connected && <CreateGuildLink />}
      </div>
    </div>
  )
}

const Page = () => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const setIsSearchStuck = useSetAtom(isSearchStuckAtom)
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

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
          <StickyBar />
          {isWeb3Connected ? (
            <YourGuilds />
          ) : (
            <Card className="my-2 mb-12 flex flex-col items-stretch justify-between gap-8 p-6 font-semibold sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <Robot className="size-8 min-w-8 text-white" />
                <span>Sign in to view your guilds / create new ones</span>
              </div>
              <Button
                className="space-x-2"
                onClick={() => setIsWalletSelectorModalOpen(true)}
              >
                <SignIn />
                <span className="text-md">Sign in</span>
              </Button>
            </Card>
          )}
          <section id={ActiveSection.ExploreGuilds}>
            <h2 className="font-bold text-lg tracking-tight">
              Explore verified guilds
            </h2>
            <div className="sticky top-8 z-10" ref={searchRef}>
              <Suspense>
                <GuildSearchBar queryAtom={guildQueryAtom} />
              </Suspense>
            </div>
            <GuildInfiniteScroll queryAtom={guildQueryAtom} />
          </section>
        </Layout.Main>
        <Layout.Footer>
          <p className="my-8 text-center text-muted-foreground text-sm">
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
