"use client";

import { buttonVariants } from "@/components/ui/Button";
import { Plus } from "@phosphor-icons/react";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { isNavStuckAtom } from "../atoms";

export const CreateGuildLink = () => {
  const isNavStuck = useAtomValue(isNavStuckAtom);
  return (
    <Link
      href="/create-guild"
      aria-label="Create guild"
      prefetch={false}
      className={buttonVariants({
        variant: "ghost",
        size: "sm",
        className: [
          // Temporarily, until we don't migrate the scrollable Tabs component
          "min-h-11 w-11 gap-1.5 px-0 sm:min-h-0 sm:w-auto sm:px-3",
          {
            "text-white": !isNavStuck,
          },
        ],
      })}
    >
      <Plus />
      <span className="hidden sm:inline-block">Create guild</span>
    </Link>
  );
};
