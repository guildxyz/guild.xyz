"use client";

import { X } from "@phosphor-icons/react/dist/ssr";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { FocusScope, type FocusScopeProps } from "@radix-ui/react-focus-scope";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "lib/cssUtils";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  forwardRef,
} from "react";
import { ScrollArea } from "./ScrollArea";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-modal grid items-end justify-center overflow-y-auto bg-black/50 backdrop-blur-sm duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:items-center",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

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
  },
);

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  trapFocus?: FocusScopeProps["trapped"];
}

const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ size, trapFocus = true, className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay>
      <FocusScope trapped={trapFocus} loop>
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            dialogContentVariants({ size, className }),
            "max-h-[calc(100vh-2*theme(space.16))]",
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </FocusScope>
    </DialogOverlay>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogCloseButton = forwardRef<
  ElementRef<typeof DialogPrimitive.Close>,
  DialogPrimitive.DialogCloseProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      "absolute top-8 right-8 rounded-full opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-ring focus-visible:ring-4 disabled:pointer-events-none data-[state=open]:text-foreground/50 md:right-10",
      className,
    )}
    {...props}
  >
    <X weight="bold" className="h-5 w-5" />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
));
DialogCloseButton.displayName = DialogPrimitive.Close.displayName;

const DialogHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 px-6 py-8 sm:px-10", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogBody = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <ScrollArea className="flex max-h-full flex-col">
    <div
      className={cn("flex flex-col px-6 pb-10 sm:px-10", className)}
      {...props}
    />
  </ScrollArea>
);
DialogBody.displayName = "DialogBody";

const DialogFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse px-6 pt-8 pb-10 sm:flex-row sm:justify-end sm:space-x-2 sm:px-10",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-display font-extrabold text-xl tracking-wide",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};