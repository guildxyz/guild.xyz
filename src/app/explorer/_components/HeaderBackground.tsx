"use client"

import { cn } from "@/lib/utils"
import { useAtomValue } from "jotai"
import { isNavStuckAtom, isSearchStuckAtom } from "../atoms"

export const HeaderBackground = () => {
  const isNavStuck = useAtomValue(isNavStuckAtom)
  const isSearchStuck = useAtomValue(isSearchStuckAtom)

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-10 h-0 bg-background shadow-md transition-all duration-200",
        {
          "h-16": isNavStuck,
          "h-[calc(theme(space.36)+theme(space.2))] bg-gradient-to-b from-background to-card-secondary sm:h-[calc(theme(space.28)-theme(space.2))]":
            isSearchStuck,
        }
      )}
    />
  )
}
