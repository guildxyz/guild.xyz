import { Badge, BadgeProps } from "@/components/ui/Badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
type Props = {
  size?: BadgeProps["size"]
}

const PrimaryAddressBadge = ({ size }: Props): JSX.Element => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge size={size}>Primary</Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          Guild owners will receive this address if they export members from their
          guild
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export default PrimaryAddressBadge
