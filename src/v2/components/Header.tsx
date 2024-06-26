"use client"

import { Navigator } from "./Navigator"
import { SignInDialog } from "./SignInDialog"

export const Header = () => (
  <header className="flex h-16 items-center justify-between p-2">
    <Navigator />
    <SignInDialog />
  </header>
)
