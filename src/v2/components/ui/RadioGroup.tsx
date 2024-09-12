"use client"

import { cn } from "@/lib/utils"
import { Check } from "@phosphor-icons/react/dist/ssr"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"

export type RadioGroupProps = ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
>

const RadioGroup = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "relative size-4 cursor-pointer rounded-full border-2 border-border text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-0 data-[state=checked]:bg-primary [&~label]:cursor-pointer [&~label]:disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center rounded-full bg-primary">
        <Check className="size-3" weight="bold" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
