"use client"

import { cn } from "@/lib/utils"
import { ClassValue } from "class-variance-authority/types"
import useIsStuck from "hooks/useIsStuck"
import { PropsWithChildren } from "react"

type Props = {
  className?: ClassValue
  setIsStuck?: Parameters<typeof useIsStuck>[0]
}

export const StickyBar = ({
  setIsStuck,
  className,
  children,
}: PropsWithChildren<Props>) => {
  const { ref, isStuck } = useIsStuck(setIsStuck)

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex h-16 w-full items-center transition-all",
        className
      )}
      ref={ref}
    >
      {children}
    </div>
  )
}
