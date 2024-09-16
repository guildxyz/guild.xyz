import { CheckMark } from "@/components/CheckMark"
import { CircularProgressBar } from "@/components/CircularProgressBar"
import { CopyableAddress } from "@/components/CopyableAddress"
import { GuildAvatar } from "@/components/GuildAvatar"
import { ProfileAvatar } from "@/components/ProfileAvatar"
import { accountModalAtom } from "@/components/Providers/atoms"
import useConnectorNameAndIcon from "@/components/Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Anchor } from "@/components/ui/Anchor"
import { Avatar } from "@/components/ui/Avatar"
import { Button, buttonVariants } from "@/components/ui/Button"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Separator } from "@/components/ui/Separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { useUserPublic } from "@/hooks/useUserPublic"
import { LevelBadge } from "@app/(marketing)/profile/_components/LevelBadge"
import { useExperienceProgression } from "@app/(marketing)/profile/_hooks/useExperienceProgression"
import { ArrowRight, DotsThreeVertical } from "@phosphor-icons/react"
import { SignOut } from "@phosphor-icons/react/dist/ssr"
import useUser from "components/[guild]/hooks/useUser"
import useResolveAddress from "hooks/useResolveAddress"
import { useAtom } from "jotai"
import { deleteKeyPairFromIdb } from "utils/keyPair"
import { useAccount } from "wagmi"
import { AccountConnections } from "./components/AccountConnections"
import { NetworkIndicator } from "./components/NetworkIndicator"
import { UsersGuildPins } from "./components/UsersGuildPins"

const AccountModal = () => {
  const { address, disconnect, type } = useWeb3ConnectionManager()
  const { connectorName } = useConnectorNameAndIcon()

  const [isOpen, setIsOpen] = useAtom(accountModalAtom)

  const { id, guildProfile } = useUser()
  const { deleteKeys } = useUserPublic()

  const { address: evmAddress, chainId } = useAccount()
  const domain = useResolveAddress(evmAddress)
  const xp = useExperienceProgression(true)

  const handleLogout = () => {
    const keysToRemove = Object.keys({ ...window.localStorage }).filter((key) =>
      /^dc_auth_[a-z]*$/.test(key)
    )

    keysToRemove.forEach((key) => {
      window.localStorage.removeItem(key)
    })

    deleteKeyPairFromIdb(id)
      ?.catch(() => {})
      .finally(() => {
        setIsOpen(false)
        disconnect()
        deleteKeys()
      })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent scrollBody>
        <DialogCloseButton />

        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>

        <DialogBody scroll>
          {address ? (
            <>
              {guildProfile ? (
                <div className="mb-8 flex gap-3">
                  {xp && (
                    <div className="relative mr-2 flex aspect-square items-center justify-center">
                      <CircularProgressBar
                        progress={xp.progress}
                        color={xp.rank.color}
                        className="absolute inset-0 size-full"
                      />
                      <Avatar
                        size="2xl"
                        className="m-1.5 flex items-center justify-center rounded-full border"
                      >
                        <ProfileAvatar
                          username={guildProfile.username}
                          profileImageUrl={guildProfile.profileImageUrl}
                        />
                      </Avatar>
                      <LevelBadge
                        level={xp.level}
                        rank={xp.rank}
                        className="absolute right-0.5 bottom-0.5"
                      />
                    </div>
                  )}
                  <div className="flex w-full flex-col justify-center">
                    <h3 className=" flex items-center font-bold">
                      <span className="max-w-52 truncate">
                        {guildProfile.name || guildProfile.username}
                      </span>
                      <CheckMark className="ml-0.5 inline-block fill-yellow-500" />
                    </h3>
                    <div className="flex gap-2 text-muted-foreground text-sm">
                      <span>@{guildProfile.username}</span>
                      <Separator orientation="vertical" />
                      {xp && (
                        <Tooltip>
                          <TooltipTrigger>{xp.experienceCount} XP</TooltipTrigger>
                          <TooltipContent>
                            {`${xp.currentLevelXp} -> `}
                            <span className="font-bold">
                              {xp.experienceCount} XP
                            </span>
                            {` -> ${xp.nextLevelXp}`}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <div className="mt-2 flex gap-1.5">
                      <Anchor
                        href={`/profile/${guildProfile.username}`}
                        className={buttonVariants({
                          className: "w-full gap-3",
                          size: "sm",
                        })}
                        variant="unstyled"
                        onClick={() => setIsOpen(false)}
                      >
                        View profile
                        <ArrowRight weight="bold" />
                      </Anchor>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="aspect-square"
                            variant="outline"
                            size="sm"
                          >
                            <DotsThreeVertical weight="bold" className="min-w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel className="mt-2 flex gap-1 px-4 text-muted-foreground">
                            Connected with {connectorName}
                            <NetworkIndicator />
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            className="flex items-center gap-2 px-4 font-semibold"
                            onClick={handleLogout}
                          >
                            <SignOut weight="bold" className="size-4" />
                            Disconnect
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full border bg-card-secondary">
                    <GuildAvatar address={address} />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <CopyableAddress
                      address={address}
                      domain={domain}
                      decimals={5}
                      className="font-bold"
                    />

                    <div className="flex items-center gap-1">
                      <p className="line-clamp-1 font-medium text-muted-foreground text-sm">
                        {`Connected with ${connectorName}`}
                      </p>
                      <NetworkIndicator />
                    </div>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="ml-auto size-8"
                        onClick={handleLogout}
                        aria-label="Disconnect"
                      >
                        <SignOut weight="bold" className="size-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Disconnect</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}

              <AccountConnections />

              <Separator className="my-6" />

              <UsersGuildPins />
            </>
          ) : (
            <p className="mb-6 font-semibold text-2xl">Not connected</p>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

export { AccountModal }
