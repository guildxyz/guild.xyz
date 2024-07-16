import { Button } from "@/components/ui/Button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { cn } from "@/lib/utils"
import { useChainId } from "wagmi"
import { CHAIN_CONFIG, Chain, Chains } from "wagmiConfig/chains"

type Props = {
  chain: Chain
  requestNetworkChange: () => void
}

const NetworkButton = ({ chain, requestNetworkChange }: Props) => {
  const chainId = useChainId()

  const isCurrentChain = Chains[chain] === chainId
  const shouldStayClosed = !isCurrentChain && !CHAIN_CONFIG[chain].deprecated

  return (
    <TooltipProvider>
      <Tooltip open={shouldStayClosed ? false : undefined}>
        <TooltipTrigger className="flex w-full">
          <Button
            disabled={isCurrentChain || CHAIN_CONFIG[chain].deprecated}
            onClick={requestNetworkChange}
            size="xl"
            className={cn("w-full justify-start", {
              "border-2": isCurrentChain,
            })}
          >
            {/* Most of these icons are SVGs or small PNGs, so we don't need to optimize them */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CHAIN_CONFIG[chain].iconUrl}
              alt={`${CHAIN_CONFIG[chain].name} logo`}
              className="size-6"
            />
            <span className="truncate">{CHAIN_CONFIG[chain].name}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>
            {isCurrentChain
              ? `${CHAIN_CONFIG[chain].name} is currently selected`
              : "Deprecated chain"}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default NetworkButton
