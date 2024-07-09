"use client"

import { cn } from "@/lib/utils"
import { SignIn } from "@phosphor-icons/react/dist/ssr"
import useUser from "components/[guild]/hooks/useUser"
import useResolveAddress from "hooks/useResolveAddress"
import { useSetAtom } from "jotai"
import shortenHex from "utils/shortenHex"
import { GuildAvatar } from "../GuildAvatar"
import { accountModalAtom, walletSelectorModalAtom } from "../Providers/atoms"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { useWeb3ConnectionManager } from "../Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover"
import { Bell } from "@phosphor-icons/react"
import { Notifications } from "./components/Notifications"

export const Account = () => {
  const { address } = useWeb3ConnectionManager()
  const setIsAccountModalOpen = useSetAtom(accountModalAtom)
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  const domainName = useResolveAddress(address)
  const { addresses } = useUser()
  const linkedAddressesCount = (addresses?.length ?? 1) - 1

  if (!address)
    return (
      <Card>
        <Button variant="ghost" onClick={() => setIsWalletSelectorModalOpen(true)}>
          <SignIn weight="bold" className="mr-1" />
          Sign in
        </Button>
      </Card>
    )

  return (
    <Card>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="rounded-r-none border-r border-border">
            <Bell />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Notifications />
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        onClick={() => setIsAccountModalOpen(true)}
        className="rounded-l-none"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-0">
            <span
              className={cn("text-base font-semibold", {
                "text-sm font-bold": linkedAddressesCount > 0,
              })}
            >
              {domainName || `${shortenHex(address, 3)}`}
            </span>
            {linkedAddressesCount > 0 && (
              <span className="text-xs font-medium text-muted-foreground">
                {`+ ${linkedAddressesCount} address${
                  linkedAddressesCount > 1 ? "es" : ""
                }`}
              </span>
            )}
          </div>
          <GuildAvatar address={address} className="size-4" />
        </div>
      </Button>
    </Card>
  )
}
