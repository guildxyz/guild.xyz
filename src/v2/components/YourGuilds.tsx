"use client"

import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useSetAtom } from "jotai"
import { GuildBase } from "types"
import { GuildCardSkeleton, GuildCardWithLink } from "./GuildCard"
import { Button } from "@/components/ui/Button"
import { SignIn } from "@phosphor-icons/react"
import Robot from "/public/landing/robot.svg"
import { Card } from "@/components/ui/Card"

const useYourGuilds = () =>
  useSWRWithOptionalAuth<GuildBase[]>(
    `/v2/guilds?yours=true`,
    undefined,
    false,
    true
  )

export const YourGuilds = () => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  const { data: usersGuilds, isLoading: isGuildsLoading } = useYourGuilds()

  if (!isWeb3Connected) {
    return (
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
    )
  }

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
