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
      "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-image",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

export interface AvatarImageProps
  extends ComponentPropsWithoutRef<typeof NextImage> {
  shrinkSvg?: boolean
}

const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, shrinkSvg = true, src, ...props }, ref) => {
  return (
    <AvatarPrimitive.Image
      className={cn(
        "aspect-square h-full w-full object-cover",
        {
          "size-[40%]": typeof src === "string" && src.endsWith(".svg") && shrinkSvg,
        },
        className
      )}
      asChild
      // @ts-expect-error: Since the props are passed down, type errors on `AvatarPrimitive` is not relevant.
      src={src}
      ref={ref}
      {...props}
    >
      {/* @ts-expect-error: Required props are already enforced and passed down to `NextImage`. */}
      <NextImage />
    </AvatarPrimitive.Image>
  )
})
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
