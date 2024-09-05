"use client"

import { cn } from "@/lib/utils"
import { CheckCircle, type Icon, Info, WarningCircle } from "@phosphor-icons/react"
import { X } from "@phosphor-icons/react/dist/ssr"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { type VariantProps, cva } from "class-variance-authority"
import {
  ComponentPropsWithoutRef,
  ElementRef,
  ReactElement,
  forwardRef,
} from "react"
import { buttonVariants } from "./Button"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitives.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 right-0 z-toast flex max-h-screen w-full max-w-[min(420px,_100%)] flex-col gap-2 p-4 focus:outline-none",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "bg-card text-foreground group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg p-4 pr-8 shadow-lg transition-transform data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full data-[state=open]:sm:slide-in-from-right-full focus:outline-none focus-visible:ring-4 focus:ring-ring",
  {
    variants: {
      variant: {
        info: "bg-alert-info [--toast-icon:theme(colors.alert.info.icon)]",
        error: "bg-alert-error [--toast-icon:theme(colors.alert.error.icon)]",
        success: "bg-alert-success [--toast-icon:theme(colors.alert.success.icon)]",
        warning: "bg-alert-warning [--toast-icon:theme(colors.alert.warning.icon)]",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

export const TOAST_ICONS = {
  info: Info,
  error: WarningCircle,
  success: CheckCircle,
  warning: WarningCircle,
} as const satisfies Record<
  NonNullable<VariantProps<typeof toastVariants>["variant"]>,
  Icon
>

const Toast = forwardRef<
  ElementRef<typeof ToastPrimitives.Root>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
))
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = forwardRef<
  ElementRef<typeof ToastPrimitives.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      buttonVariants({
        size: "sm",
        className: ["gap-1 rounded-md", className],
      })
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitives.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute top-2 right-2 rounded-full p-1 text-foreground/50 opacity-0 ring-ring transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus-visible:ring-4 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X weight="bold" className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitives.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("font-bold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitives.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>((props, ref) => <ToastPrimitives.Description ref={ref} {...props} />)
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = ReactElement<typeof ToastAction>

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps,
}
