"use client"

import { SignIn } from "phosphor-react"
import { Navigator } from "./Navigator"
import { Button } from "./ui/Button"

export const Header = () => (
  <header className="h-16 flex items-center justify-between p-2">
    <Navigator />
    <Button variant="secondary" className="space-x-2">
      <SignIn className="size-4" />
      <span className="text-base font-medium">Sign in</span>
    </Button>
  </header>
)
