"use client";

import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export const RoleGroupNavLink = ({
  tab,
}: { tab: { label: string; path: string; segment: string } }) => {
  const layoutSegment = useSelectedLayoutSegment();
  const isActive = tab.segment === layoutSegment;

  return (
    <Link
      key={tab.label + tab.path}
      className={buttonVariants({
        variant: "subtle",
        colorScheme: isActive ? "primary" : "secondary",
      })}
      href={tab.path}
    >
      {tab.label}
    </Link>
  );
};
