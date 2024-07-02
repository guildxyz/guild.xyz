import { CopyableAddress } from "@/components/CopyableAddress"
import { GuildAvatar } from "@/components/GuildAvatar"
import { accountModalAtom } from "@/components/Providers/Providers"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import useConnectorNameAndIcon from "@/components/Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useUserPublic } from "@/hooks/useUserPublic"
import { SignOut } from "@phosphor-icons/react/dist/ssr"
import useUser from "components/[guild]/hooks/useUser"
import { useAtom } from "jotai"
import { deleteKeyPairFromIdb } from "utils/keyPair"
import { useAccount } from "wagmi"

const AccountModal = () => {
  const { address, disconnect } = useWeb3ConnectionManager()
  const { connectorName } = useConnectorNameAndIcon()

  const [isOpen, setIsOpen] = useAtom(accountModalAtom)
  const onClose = () => setIsOpen(false)

  const { id } = useUser()
  const { deleteKeys } = useUserPublic()

  const { address: evmAddress } = useAccount()
  // const domain = useResolveAddress(evmAddress)
  //TODO
  const domain = ""

  // TODO: do we need to keep the network modal? We should check the number of "Opened network modal" PostHog events and decide if we should keep it or not.

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
    <Dialog open={isOpen}>
      <DialogContent onPointerDownOutside={onClose} onEscapeKeyDown={onClose}>
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>

        {address ? (
          <>
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
                  <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
                    {`Connected with ${connectorName}`}
                  </p>
                </div>
                {/* <NetworkModal
                    isOpen={isNetworkModalOpen}
                    onClose={closeNetworkModal}
                  /> */}
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="ml-auto size-8"
                      onClick={handleLogout}
                      aria-label="Disconnect"
                    >
                      <SignOut className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Disconnect</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* <AccountConnections /> */}
            {/* <hr className="my-4" /> */}
            {/*TODO: <UsersGuildPins /> */}
          </>
        ) : (
          <p className="mb-6 text-2xl font-semibold">Not connected</p>
        )}

        <DialogCloseButton onClick={onClose} />
      </DialogContent>
    </Dialog>
  )
}

export { AccountModal }
