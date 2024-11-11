import { Anchor } from "@/components/ui/Anchor"
import { Badge, badgeVariants } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { cn } from "@/lib/utils"
import { Check, Copy } from "@phosphor-icons/react/dist/ssr"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import { Dispatch, SetStateAction } from "react"
import shortenHex from "utils/shortenHex"
import { CHAIN_CONFIG, Chain } from "wagmiConfig/chains"

type Props = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export const PoolDetailsDialog = ({ open, onOpenChange }: Props) => {
  const { guildPlatform } = useRolePlatform()

  const { chain, poolId, contractAddress } = guildPlatform.platformGuildData

  const chainIcon = CHAIN_CONFIG[chain as Chain].iconUrl
  const chainName = CHAIN_CONFIG[chain as Chain].name
  const blockExplorerUrl = CHAIN_CONFIG[chain as Chain].blockExplorerUrl

  const { hasCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pool details</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex h-8 items-center justify-between">
            <span className="font-bold">Chain</span>
            <Badge>
              <img src={chainIcon} alt={chainName} className="size-4" />
              <span>{chainName}</span>
            </Badge>
          </div>

          <div className="flex h-8 items-center justify-between">
            <span className="font-bold">Contract</span>
            <Badge>
              <Anchor
                href={`${blockExplorerUrl}/address/${contractAddress}`}
                className="hover:underline-offset-1"
                target="_blank"
                showExternal
              >
                {shortenHex(contractAddress)}
              </Anchor>
            </Badge>
          </div>

          <div className="flex h-8 items-center justify-between">
            <span className="font-bold">Pool ID</span>
            <Button
              className={cn(badgeVariants({ className: "" }))}
              size="sm"
              leftIcon={hasCopied ? <Check weight="bold" /> : <Copy weight="bold" />}
              onClick={() => copyToClipboard(poolId.toString())}
            >
              {`#${poolId}`}
            </Button>
          </div>
        </DialogBody>

        <DialogCloseButton />
      </DialogContent>
    </Dialog>
  )
}
