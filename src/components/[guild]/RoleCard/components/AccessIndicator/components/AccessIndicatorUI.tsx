import { Badge, BadgeProps } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import { CircleNotch } from "@phosphor-icons/react/dist/ssr"
import { ReactNode } from "react"

type Props = {
  isLoading?: boolean
  colorScheme: BadgeProps["colorScheme"]
  icon?: ReactNode
  label: string
  className?: string
}

const ACCESS_INDICATOR_CLASSNAME =
  "flex shrink-0 justify-between rounded-bl-lg rounded-br-lg rounded-tl-none rounded-tr-none px-5 py-2 md:justify-start md:px-3 md:py-0 md:rounded-tl-lg md:rounded-tr-lg text-sm"

const AccessIndicatorUI = ({
  isLoading,
  colorScheme,
  icon,
  label,
  className,
}: Props): JSX.Element => (
  <Badge
    size="lg"
    colorScheme={colorScheme}
    className={cn(ACCESS_INDICATOR_CLASSNAME, "h-8", className)}
  >
    {isLoading ? (
      <CircleNotch weight="bold" className="animate-spin duration-500" />
    ) : (
      icon
    )}
    <span>{label}</span>
  </Badge>
)

export { AccessIndicatorUI, ACCESS_INDICATOR_CLASSNAME }
