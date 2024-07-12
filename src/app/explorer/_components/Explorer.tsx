"use client"

import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { useUserPublic } from "@/hooks/useUserPublic"
import { SignIn } from "@phosphor-icons/react"
import { GuildSearchBar } from "app/explorer/_components/GuildSearchBar"
import { YourGuilds } from "app/explorer/_components/YourGuilds"
import useIsStuck from "hooks/useIsStuck"
import { useSetAtom } from "jotai"
import { Suspense } from "react"
import Robot from "/public/landing/robot.svg"
import { guildQueryAtom, isSearchStuckAtom } from "../atoms"
import { ActiveSection } from "../types"
import { GuildInfiniteScroll } from "./GuildInfiniteScroll"
import { StickyBar } from "./StickyBar"

export const Explorer = () => {
  const { keyPair } = useUserPublic()
  const setIsSearchStuck = useSetAtom(isSearchStuckAtom)
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  const { ref: searchRef } = useIsStuck(setIsSearchStuck)

  return (
    <>
      <StickyBar />

      {!!keyPair ? (
        <YourGuilds />
      ) : (
        <Card className="mt-2 mb-8 flex flex-col items-stretch justify-between gap-8 p-6 font-semibold sm:flex-row sm:items-center">
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

      <section id={ActiveSection.ExploreGuilds} className="flex flex-col gap-5">
        <h2 className="font-bold text-lg tracking-tight">Explore verified guilds</h2>
        <div className="sticky top-12 z-10" ref={searchRef}>
          <Suspense>
            <GuildSearchBar queryAtom={guildQueryAtom} />
          </Suspense>
        </div>
        <GuildInfiniteScroll queryAtom={guildQueryAtom} />
      </section>
    </>
  )
}
