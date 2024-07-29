import { useDisconnectAddress } from "@/components/Account/components/AccountModal/hooks/useDisconnect"
import { CopyableAddress } from "@/components/CopyableAddress"
import { GuildAvatar } from "@/components/GuildAvatar"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Skeleton } from "@/components/ui/Skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { useDisclosure } from "@/hooks/useDisclosure"
import {
  CircleNotch,
  DotsThree,
  LinkBreak,
  UserSwitch,
} from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import { User } from "types"
import shortenHex from "utils/shortenHex"
import useEditPrimaryAddress from "../hooks/useEditPrimaryAddress"
import AddressTypeTag from "./AddressTypeBadge"
import PrimaryAddressTag from "./PrimaryAddressBadge"

type Props = {
  addressData: User["addresses"][number]
}

const LinkedAddress = ({ addressData }: Props) => {
  const { address, isDelegated, isPrimary, walletType } = addressData ?? {}
  const { address: connectedAddress } = useWeb3ConnectionManager()

  const isCurrent = address?.toLowerCase() === connectedAddress.toLowerCase()

  const {
    onSubmit: onEditPrimaryAddressSubmit,
    isLoading: isEditPrimaryAddressLoading,
  } = useEditPrimaryAddress()

  const { isOpen, onOpen, onClose, setValue: setDisclosureState } = useDisclosure()

  const {
    onSubmit: onDisconnectSubmit,
    isLoading: isDisconnectLoading,
    signLoadingText: disconnectSignLoadingText,
  } = useDisconnectAddress(onClose)

  const removeAddress = () => onDisconnectSubmit({ address })

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-full">
          <GuildAvatar address={address} className="-mt-1 size-4" />
        </div>

        <div className="flex flex-wrap space-x-1">
          <CopyableAddress
            address={address}
            decimals={5}
            className="mr-0.5 font-bold text-sm"
          />
          {isDelegated && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge>
                  <Image
                    width={15}
                    height={15}
                    src={`/walletLogos/delegatecash.png`}
                    alt="Delegate cash logo"
                  />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <span>Delegate.cash</span>
              </TooltipContent>
            </Tooltip>
          )}
          {walletType !== "EVM" && <AddressTypeTag type={walletType} size="sm" />}
          {isCurrent && (
            <Badge size="sm" colorScheme="blue">
              Current
            </Badge>
          )}
          {isPrimary && <PrimaryAddressTag size="sm" />}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="ml-auto size-8 rounded-full px-0"
              variant="ghost"
              aria-label="Disconnect account"
            >
              <DotsThree weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {!isPrimary && (
              <DropdownMenuItem
                disabled={isEditPrimaryAddressLoading}
                onClick={() =>
                  onEditPrimaryAddressSubmit({
                    address,
                    isPrimary: true,
                  })
                }
              >
                {isEditPrimaryAddressLoading ? (
                  <CircleNotch weight="bold" className="mr-1.5 animate-spin" />
                ) : (
                  <UserSwitch weight="bold" className="mr-1.5" />
                )}
                Set as primary
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={onOpen}
              className="text-destructive-subtle-foreground"
            >
              <LinkBreak weight="bold" className="mr-1.5" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={isOpen} onOpenChange={setDisclosureState}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? You'll be kicked from the guilds you have the
              requirement(s) to with{" "}
              <span className="whitespace-nowrap font-semibold">
                {shortenHex(address, 3)}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                colorScheme="destructive"
                onClick={removeAddress}
                isLoading={isDisconnectLoading}
                loadingText={disconnectSignLoadingText || "Removing"}
              >
                Continue
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const LinkedAddressSkeleton = () => (
  <div className="flex w-full items-center gap-2 py-0.5">
    <Skeleton className="size-7 rounded-full" />
    <Skeleton className="h-5 w-36" />
  </div>
)

export default LinkedAddress
