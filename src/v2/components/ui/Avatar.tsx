"use client"

import { cn } from "@/lib/utils"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import NextImage from "next/image"
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"

const Avatar = forwardRef<
  ElementRef<typeof AvatarPrimitive.Root>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  ComponentPropsWithoutRef<typeof NextImage & typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    className={cn("aspect-square h-full w-full object-cover", className)}
    asChild
    ref={ref}
    {...props}
  >
    {/* @ts-expect-error: Required props are already enforced and passed down to `NextImage`. */}
    <NextImage />
  </AvatarPrimitive.Image>
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = forwardRef<
  ElementRef<typeof AvatarPrimitive.Fallback>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
