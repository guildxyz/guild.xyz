import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { cn } from "@/lib/utils"
import { PushPin } from "@phosphor-icons/react/dist/ssr"

export const FeaturedIcon = ({ className }: { className?: string }) => (
  <Tooltip>
    <TooltipTrigger
      className={cn(
        "inline-flex size-6 cursor-default items-center justify-center rounded-md border border-neutral-500 bg-black align-middle",
        className
      )}
    >
      <PushPin className="size-3" weight="bold" />
    </TooltipTrigger>
    <TooltipContent className="!font-body text-sm">
      This Guild is featured by the Guild.xyz team
    </TooltipContent>
  </Tooltip>
)
