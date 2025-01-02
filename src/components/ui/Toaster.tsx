"use client";

import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "flex items-start group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg data-[button]:bg-button-primary-background gap-2 focus-visible:ring-2",
          title: "font-bold",
          description: "group-[.toast]:text-foreground-dimmed",
          actionButton:
            "group-[.toast]:!bg-button-primary-background group-[.toast]:!text-button-primary-foreground",
          closeButton:
            "group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border-border",
          icon: "group-[.toast]:[&>svg]:size-5",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
