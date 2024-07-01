"use client"

<<<<<<< .merge_file_NEVmr7
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
=======
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as React from "react"
>>>>>>> .merge_file_l9XW0u

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

<<<<<<< .merge_file_NEVmr7
const Tooltip: React.FC<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>> = (({ ...props }) => (<TooltipPrimitive.Root delayDuration={0} {...props} />))
=======
const Tooltip: React.FC<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>
> = ({ ...props }) => <TooltipPrimitive.Root delayDuration={0} {...props} />
>>>>>>> .merge_file_l9XW0u

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
<<<<<<< .merge_file_NEVmr7
      "z-50 overflow-hidden rounded-md bg-popover-foreground px-3 py-1.5 text-sm text-popover shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 font-semibold duration-0",
      className
    )}
    {...props}
  >{children}<TooltipPrimitive.Arrow className="fill-popover-foreground" /></TooltipPrimitive.Content>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
=======
      "bg-tooltip text-tooltip-foreground z-50 overflow-hidden rounded-xl px-3 py-1.5 text-sm shadow-md duration-0 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  >
    {children}
    {/* <TooltipPrimitive.Arrow className="fill-popover-foreground" /> */}
  </TooltipPrimitive.Content>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
>>>>>>> .merge_file_l9XW0u
