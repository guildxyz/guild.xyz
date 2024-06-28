"use client"

import { Account } from "./Account"
import { Navigator } from "./Navigator"

export const Header = () => (
  <header className="flex h-16 w-full items-center justify-between p-2">
    <Navigator />
    <Account />
  </header>
)
