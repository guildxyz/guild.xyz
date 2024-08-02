import { CheckMark } from "@/components/CheckMark"
import { CopyableAddress } from "@/components/CopyableAddress"
import { GuildAvatar } from "@/components/GuildAvatar"
import { accountModalAtom } from "@/components/Providers/atoms"
import useConnectorNameAndIcon from "@/components/Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Anchor } from "@/components/ui/Anchor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button, buttonVariants } from "@/components/ui/Button"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Separator } from "@/components/ui/Separator"
import { Skeleton } from "@/components/ui/Skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { useDisclosure } from "@/hooks/useDisclosure"
import { useUserPublic } from "@/hooks/useUserPublic"
import {
  ArrowRight,
  CreditCard,
  DotsThreeVertical,
  File,
} from "@phosphor-icons/react"
import { LinkBreak, SignOut } from "@phosphor-icons/react/dist/ssr"
import useUser from "components/[guild]/hooks/useUser"
import useResolveAddress from "hooks/useResolveAddress"
import { useAtom } from "jotai"
import { deleteKeyPairFromIdb } from "utils/keyPair"
import { useAccount } from "wagmi"
import { CHAIN_CONFIG, Chains } from "wagmiConfig/chains"
import NetworkModal from "../NetworkModal"
import { AccountConnections } from "./components/AccountConnections"
import { UsersGuildPins } from "./components/UsersGuildPins"

const AccountModal = () => {
  const { address, disconnect, type } = useWeb3ConnectionManager()
  const { connectorName } = useConnectorNameAndIcon()

  const [isOpen, setIsOpen] = useAtom(accountModalAtom)

  const { id, guildProfile } = useUser()
  const { deleteKeys } = useUserPublic()

  const { address: evmAddress, chainId } = useAccount()
  const domain = useResolveAddress(evmAddress)

  const {
    isOpen: isNetworkModalOpen,
    onOpen: openNetworkModal,
    onClose: closeNetworkModal,
  } = useDisclosure()

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
        </DialogHeader>

        <DialogBody scroll>
          {address ? (
            <>
              {guildProfile ? (
                <div className="mb-8 flex gap-3">
                  <Avatar size="2xl" className="mr-2 self-center">
                    {guildProfile.profileImageUrl && (
                      <AvatarImage
                        src={guildProfile.profileImageUrl}
                        alt="profile avatar"
                        width={78}
                        height={78}
                      />
                    )}
                    <AvatarFallback>
                      <Skeleton className="size-full" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex w-full flex-col gap-1">
                    <h3 className="flex items-center font-bold">
                      {guildProfile.name}
                      <CheckMark className="ml-2 inline-block fill-yellow-500" />
                    </h3>
                    <div className="text-muted-foreground">1999 / 2000 XP</div>
                    <div className="mt-1 flex gap-2">
                      <Anchor
                        href={`/profile/${guildProfile.username}`}
                        className={buttonVariants({ className: "w-full gap-3" })}
                        variant="unstyled"
                      >
                        View profile
                        <ArrowRight weight="bold" />
                      </Anchor>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="aspect-square" variant="outline">
                            <DotsThreeVertical weight="bold" className="min-w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem className="flex items-center gap-2 px-4 font-semibold">
                            <CreditCard weight="bold" className="size-4" />
                            Manage subscription
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 px-4 font-semibold">
                            <File weight="bold" className="size-4" />
                            Purchase history
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="mt-3 px-4 text-muted-foreground">
                            Connected with MetaMask
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

                      {type === "EVM" ? (
                        <Button
                          variant="ghost"
                          onClick={() => openNetworkModal()}
                          size="xs"
                          className="w-6 px-0"
                        >
                          {CHAIN_CONFIG[Chains[chainId]] ? (
                            <img
                              src={CHAIN_CONFIG[Chains[chainId]].iconUrl}
                              alt={CHAIN_CONFIG[Chains[chainId]].name}
                              className="size-4"
                            />
                          ) : (
                            <LinkBreak weight="bold" />
                          )}
                        </Button>
                      ) : (
                        <img
                          src="/walletLogos/fuel.svg"
                          alt="Fuel"
                          className="size-4"
                        />
                      )}
                    </div>
                    <NetworkModal
                      isOpen={isNetworkModalOpen}
                      onClose={closeNetworkModal}
                    />
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
