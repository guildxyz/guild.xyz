import { PropsWithChildren } from "react"
import { Header as NavHeader } from "../Header"

export const Header = ({ children }: PropsWithChildren) => (
  <header className="relative">
    <NavHeader />
    {children}
  </header>
)
