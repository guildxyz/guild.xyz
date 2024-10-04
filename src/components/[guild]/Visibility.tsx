import { Badge, BadgeProps } from "@/components/ui/Badge"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { cn } from "@/lib/utils"
import { Visibility as VisibilityType } from "@guildxyz/types"
import useVisibilityTooltipLabel from "./SetVisibility/hooks/useVisibilityTooltipLabel"
import { VISIBILITY_DATA } from "./SetVisibility/visibilityData"

interface Props extends BadgeProps {
  entityVisibility: VisibilityType
  visibilityRoleId: number | null
}

const Visibility = ({
  entityVisibility,
  visibilityRoleId,
  className,
  ...badgeProps
}: Props) => {
  const VisibilityIcon = VISIBILITY_DATA[entityVisibility].Icon

  const label = useVisibilityTooltipLabel(entityVisibility, visibilityRoleId)

  if (entityVisibility === "PUBLIC") return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          tabIndex={0}
          className={cn("cursor-default", className)}
          {...badgeProps}
        >
          <VisibilityIcon weight="bold" />
          <span>{VISIBILITY_DATA[entityVisibility].title}</span>
        </Badge>
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent className="max-w-[80vw] text-left sm:max-w-max">
          {label}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

export { Visibility }
