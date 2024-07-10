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
import { NotificationContent } from "./components/Notification/NotificationContent"
import { usePostHogContext } from "../Providers/PostHogProvider"
// import { useLocalStorage } from "usehooks-ts"
import { useDisclosure } from "@/hooks/useDisclosure"

export const Account = () => {
  const { address } = useWeb3ConnectionManager()
  const setIsAccountModalOpen = useSetAtom(accountModalAtom)
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const { isOpen, setValue } = useDisclosure()

  const domainName = useResolveAddress(address)
  const { addresses } = useUser()
  const linkedAddressesCount = (addresses?.length ?? 1) - 1

  const { captureEvent } = usePostHogContext()
  // const [clickedOnNotifications, setClickedOnNotifications] = useLocalStorage(
  //   "clicked-web3inbox-feature-notification",
  //   false
  // )

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
      <Popover open={true} onOpenChange={setValue}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-r-none border-r border-border"
            aria-label="Notifications"
            onClick={() => {
              //   setClickedOnNotifications(true)
              if (isOpen) return
              captureEvent("opened UserActivityLogPopover")
            }}
          >
            <Bell />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="px-0">
          <NotificationContent />
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
