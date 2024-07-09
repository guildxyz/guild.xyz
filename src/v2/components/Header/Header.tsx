"use client"

import { Account } from "../Account"
import { NavMenu } from "./NavMenu"

const Header = () => (
  <header className="relative flex h-16 w-full items-center justify-between p-2">
    <NavMenu />
    <Account />
  </header>
)

export { Header }
