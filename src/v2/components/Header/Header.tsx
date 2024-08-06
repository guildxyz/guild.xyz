"use client"

import { cn } from "@/lib/utils"
import { Account } from "../Account"
import { NavMenu } from "./NavMenu"

const Header = ({ className }: { className?: string }) => (
  <header
    className={cn(
      "relative flex h-16 w-full items-center justify-between p-2",
      className
    )}
  >
    <NavMenu />
    <Account />
  </header>
)

export { Header }
