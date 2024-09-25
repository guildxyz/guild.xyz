import { Badge, BadgeProps } from "@/components/ui/Badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { cn } from "@/lib/utils"
import { Icon } from "@phosphor-icons/react/dist/lib/types"
import { PropsWithChildren, useState } from "react"

type Props = {
  colorScheme: NonNullable<Exclude<BadgeProps["colorScheme"], "gold">>
  icon: Icon
  isAlwaysOpen?: boolean
}

const CIRCLE_BG_CLASS = {
  gray: "bg-secondary",
  blue: "bg-info dark:bg-info-subtle-foreground",
  green: "bg-success dark:bg-success-subtle-foreground",
  orange: "bg-warning  dark:bg-warning-subtle-foreground",
} satisfies Record<Props["colorScheme"], string>

const RequirementAccessIndicatorUI = ({
  colorScheme,
  icon: IconComponent,
  isAlwaysOpen,
  children,
}: PropsWithChildren<Props>) => {
  const [openCount, setOpenCount] = useState(0)

  return (
    <div className="flex items-center justify-center pl-6">
      <Tooltip
        // just an easter egg appreciating the cool morphing animation we have
        onOpenChange={(open) => {
          if (isAlwaysOpen || !open) return
          setOpenCount((count) => count + 1)
        }}
      >
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative size-2 overflow-hidden rounded-lg transition-all duration-150 hover:size-7 hover:rounded-none hover:bg-transparent data-[state=delayed-open]:size-7 data-[state=delayed-open]:rounded-none data-[state=delayed-open]:bg-transparent [&>*]:opacity-0 [&>*]:transition-opacity [&>*]:duration-150 [&>*]:hover:opacity-100 [&>*]:data-[state=delayed-open]:opacity-100",
              CIRCLE_BG_CLASS[colorScheme],
              {
                "!bg-transparent size-7 rounded-none [&>*]:opacity-100":
                  isAlwaysOpen,
              }
            )}
          >
            <Badge
              colorScheme={colorScheme}
              className="absolute inset-0 h-auto max-w-none justify-center p-0"
            >
              <IconComponent weight="bold" />
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent variant="popover" side="left" className="p-2.5 text-left">
          {!isAlwaysOpen && [5, 10].includes(openCount)
            ? openCount === 5
              ? "👀"
              : "🙈"
            : children}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export { RequirementAccessIndicatorUI }
