import { CopyableAddress } from "@/components/CopyableAddress"
import { GuildAvatar } from "@/components/GuildAvatar"
import { purchaseHistoryDrawerAtom } from "@/components/Providers/atoms"
import useConnectorNameAndIcon from "@/components/Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { IconButton } from "@/components/ui/IconButton"
import { DotsThreeVertical, File, SignOut } from "@phosphor-icons/react"
import useResolveAddress from "hooks/useResolveAddress"
import { useSetAtom } from "jotai"
import { useAccount } from "wagmi"
import { NetworkIndicator } from "./NetworkIndicator"

type AccountProps = {
  handleLogout: () => void
}

export const Account = ({ handleLogout }: AccountProps) => {
  const { address } = useWeb3ConnectionManager()
  const { connectorName } = useConnectorNameAndIcon()

  const { address: evmAddress } = useAccount()
  const domain = useResolveAddress(evmAddress ?? "")

  const setIsPurchaseHistoryOpen = useSetAtom(purchaseHistoryDrawerAtom)

  if (!address) return null

  return (
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            className="ml-auto"
            aria-label="Open menu"
            variant="outline"
            size="sm"
            icon={<DotsThreeVertical weight="bold" />}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center gap-2 px-4 font-semibold"
            onClick={() => setIsPurchaseHistoryOpen(true)}
          >
            <File weight="bold" className="size-4" />
            Purchase history
          </DropdownMenuItem>
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
  )
}
