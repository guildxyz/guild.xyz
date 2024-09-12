"use client"

import { CircularProgressBar } from "@/components/CircularProgressBar"
import { useDisclosure } from "@/hooks/useDisclosure"
import { cn } from "@/lib/utils"
import { useExperienceProgression } from "@app/(marketing)/profile/_hooks/useExperienceProgression"
import { Bell } from "@phosphor-icons/react"
import { SignIn } from "@phosphor-icons/react/dist/ssr"
import useUser from "components/[guild]/hooks/useUser"
import useResolveAddress from "hooks/useResolveAddress"
import { useSetAtom } from "jotai"
import shortenHex from "utils/shortenHex"
import { GuildAvatar } from "../GuildAvatar"
import { ProfileAvatar } from "../ProfileAvatar"
import { usePostHogContext } from "../Providers/PostHogProvider"
import { accountModalAtom, walletSelectorModalAtom } from "../Providers/atoms"
import { useWeb3ConnectionManager } from "../Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Avatar } from "../ui/Avatar"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover"
import { Skeleton } from "../ui/Skeleton"
import { NotificationContent } from "./components/Notification/NotificationContent"

export const Account = () => {
  const { address, isWeb3Connected } = useWeb3ConnectionManager()
  const setIsAccountModalOpen = useSetAtom(accountModalAtom)
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const { isOpen, setValue } = useDisclosure()

  const domainName = useResolveAddress(address)
  const { addresses, guildProfile, isLoading } = useUser()
  const linkedAddressesCount = (addresses?.length ?? 1) - 1
  const { captureEvent } = usePostHogContext()
  const xp = useExperienceProgression(true)

  if (isLoading || isWeb3Connected === null) {
    return (
      <Card className="overflow-hidden">
        <Skeleton className="h-11 w-36" />
      </Card>
    )
  }
  if (!address) {
    return (
      <Card className="overflow-visible">
        <Button
          variant="ghost"
          onClick={() => setIsWalletSelectorModalOpen(true)}
          data-testid="sign-in-button"
          className="rounded-2xl"
        >
          <SignIn weight="bold" />
          Sign in
        </Button>
      </Card>
    )
  }
  return (
    <Card className="flex items-center overflow-visible" data-testid="account-card">
      <Popover open={isOpen} onOpenChange={setValue}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-r-none rounded-l-2xl border-border border-r"
            aria-label="Notifications"
            onClick={() => {
              if (isOpen) return
              captureEvent("opened UserActivityLogPopover")
            }}
          >
            <Bell weight="bold" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[min(100vw,theme(space.96))] px-0">
          <NotificationContent />
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        onClick={() => setIsAccountModalOpen(true)}
        className="rounded-r-2xl rounded-l-none"
      >
        {guildProfile ? (
          <div className="flex items-center gap-2">
            <div className="relative p-0.5">
              {xp && (
                <CircularProgressBar
                  className="absolute inset-0 size-full"
                  progress={xp.progress}
                  color={xp.rank.color}
                />
              )}
              <Avatar size="sm">
                <ProfileAvatar
                  username={guildProfile.username}
                  profileImageUrl={guildProfile.profileImageUrl}
                />
              </Avatar>
            </div>
            <div className="flex flex-col items-start">
              <div className="max-w-24 truncate font-bold text-sm leading-tight">
                {guildProfile.name || guildProfile.username}
              </div>
              <div className="text-muted-foreground text-xs">
                {xp
                  ? `${xp.experienceCount} / ${xp.nextLevelXp} XP`
                  : `@${guildProfile.username}`}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-0">
              <span
                className={cn("font-semibold text-base", {
                  "font-bold text-sm": linkedAddressesCount > 0,
                })}
              >
                {domainName || `${shortenHex(address, 3)}`}
              </span>
              {linkedAddressesCount > 0 && (
                <span className="font-medium text-muted-foreground text-xs">
                  {`+ ${linkedAddressesCount} address${
                    linkedAddressesCount > 1 ? "es" : ""
                  }`}
                </span>
              )}
            </div>
            <GuildAvatar address={address} className="size-4" />
          </div>
        )}
      </Button>
    </Card>
  )
}
