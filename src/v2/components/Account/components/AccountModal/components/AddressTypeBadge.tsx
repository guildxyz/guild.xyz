import { Badge, BadgeProps } from "@/components/ui/Badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { User } from "types"

type AddressType = Exclude<User["addresses"][number]["walletType"], "EVM">

type Props = {
  type: AddressType
  size?: BadgeProps["size"]
}

const TYPE_ICONS: Record<AddressType, string> = {
  FUEL: "/walletLogos/fuel.svg",
}

const TYPE_NAMES: Record<AddressType, string> = {
  FUEL: "Fuel",
}

const AddressTypeBadge = ({ type, size }: Props) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge size={size} className="px-1">
          <img src={TYPE_ICONS[type]} alt={TYPE_NAMES[type]} className="size-3" />
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <span>{TYPE_NAMES[type]}</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export default AddressTypeBadge
