"use client";

import {
  Button,
  type ButtonProps,
  buttonVariants,
} from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

export const RoleGroupNavLink = ({
  href,
  children,
}: PropsWithChildren<{ href: string }>) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Card className="bg-card-secondary">
      <Link
        href={href}
        className={buttonVariants({
          variant: "ghost",
          className: [
            "focus-visible:bg-[var(--button-bg-hover)]",
            { "bg-[var(--button-bg-active)]": isActive },
          ],
        })}
      >
        {children}
      </Link>
    </Card>
  );
};

export const RoleGroupNavButton = ({
  children,
  leftIcon,
  className,
}: PropsWithChildren<Pick<ButtonProps, "leftIcon" | "className">>) => (
  <Card className="bg-card-secondary">
    <Button variant="ghost" leftIcon={leftIcon} className={className}>
      {children}
    </Button>
  </Card>
);
