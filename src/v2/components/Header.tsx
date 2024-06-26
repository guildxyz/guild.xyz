"use client"

import { SignIn } from "@phosphor-icons/react"
import { Navigator } from "./Navigator"
import { Button } from "./ui/Button"

export const Header = () => (
  <header className="flex h-16 items-center justify-between p-2">
    <Navigator />
    <Button variant="outline" className="space-x-2" size="lg">
      <SignIn className="size-4" />
      <span>Sign in</span>
    </Button>
  </header>
)
