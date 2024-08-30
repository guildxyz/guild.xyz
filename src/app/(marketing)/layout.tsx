import { ConfettiProvider } from "@/components/Confetti"
import { PropsWithChildren } from "react"

const Layout = ({ children }: PropsWithChildren) => {
  return <ConfettiProvider>{children}</ConfettiProvider>
}

export default Layout
