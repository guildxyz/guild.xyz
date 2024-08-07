import { cn } from "@/lib/utils"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { VariantProps, cva } from "class-variance-authority"
import NextImage from "next/image"
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
import { Skeleton } from "./Skeleton"

export const avatarVariants = cva(
  "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-image",
  {
    variants: {
      size: {
        xs: "size-5",
        sm: "size-7",
        md: "size-10",
        lg: "size-12",
        xl: "size-16",
        "2xl": "size-20",
        "3xl": "size-28",
      },
    },
    defaultVariants: {
      size: "md",
    },
  } as const
)

const Avatar = forwardRef<
  ElementRef<typeof AvatarPrimitive.Root>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants>
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

export interface AvatarImageProps
  extends ComponentPropsWithoutRef<typeof NextImage> {}

const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, src, ...props }, ref) => {
  return (
    <AvatarPrimitive.Image
      className={cn(
        "aspect-square h-full w-full object-cover",
        {
          "size-[40%]": typeof src === "string" && src.match("guildLogos"),
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
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  >
    {children || <Skeleton className="size-full" />}
  </AvatarPrimitive.Fallback>
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
