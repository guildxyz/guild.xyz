"use client"

import { cn } from "@/lib/utils"
import { X } from "@phosphor-icons/react/dist/ssr"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { FocusScope, FocusScopeProps } from "@radix-ui/react-focus-scope"
import { VariantProps, cva } from "class-variance-authority"
import {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
  forwardRef,
} from "react"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-modal grid items-end justify-center overflow-y-auto bg-black/50 backdrop-blur-sm duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:items-center",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

export const dialogContentVariants = cva(
  "flex flex-col mt-4 md:my-16 relative rounded-xl max-sm:rounded-b-none bg-card shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 focus-visible:outline-none ring-ring focus-visible:ring-4 ring-offset-0",
  {
    variants: {
      size: {
        sm: "w-[min(theme(maxWidth.sm),_100vw)]",
        md: "w-[min(theme(maxWidth.md),_100vw)]",
        lg: "w-[min(theme(maxWidth.lg),_100vw)]",
        xl: "w-[min(theme(maxWidth.xl),_100vw)]",
        "2xl": "w-[min(theme(maxWidth.2xl),_100vw)]",
        "3xl": "w-[min(theme(maxWidth.3xl),_100vw)]",
        "4xl": "w-[min(theme(maxWidth.4xl),_100vw)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  scrollBody?: boolean
  overlayClasses?: string
  trapFocus?: FocusScopeProps["trapped"]
}

const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      size,
      trapFocus = true,
      className,
      scrollBody,
      children,
      overlayClasses,
      ...props
    },
    ref
  ) => (
    <DialogPortal>
      <DialogOverlay className={overlayClasses}>
        <FocusScope trapped={trapFocus} loop>
          <DialogPrimitive.Content
            ref={ref}
            className={cn(dialogContentVariants({ size, className }), {
              "max-h-[calc(100vh-2*theme(space.16))]": scrollBody,
            })}
            {...props}
          >
            {children}
          </DialogPrimitive.Content>
        </FocusScope>
      </DialogOverlay>
    </DialogPortal>
  )
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogCloseButton = forwardRef<
  ElementRef<typeof DialogPrimitive.Close>,
  DialogPrimitive.DialogCloseProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      "absolute top-8 right-8 rounded-full opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-ring focus-visible:ring-4 disabled:pointer-events-none data-[state=open]:text-muted-foreground md:right-10",
      className
    )}
    {...props}
  >
    <X weight="bold" className="h-5 w-5" />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
))
DialogCloseButton.displayName = DialogPrimitive.Close.displayName

const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 px-6 py-8 sm:px-10", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

interface DialogBodyProps extends HTMLAttributes<HTMLDivElement> {
  scroll?: boolean
}
const DialogBody = ({ className, scroll, ...props }: DialogBodyProps) => (
  <div
    className={cn(
      "flex flex-col overflow-visible px-6 pb-10 has-[~div]:pb-0 sm:px-10",
      {
        "custom-scrollbar flex-shrink-1 flex-grow-1 overflow-y-auto": scroll,
      },
      className
    )}
    {...props}
  />
)
DialogBody.displayName = "DialogBody"

const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-row justify-end space-x-2 px-6 pt-8 pb-10 sm:px-10",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-bold font-display text-xl tracking-wide", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("mt-2 text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
