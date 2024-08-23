import { ConfettiProvider } from "@/components/Confetti"
import type { Metadata } from "next"
import { PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "Create profile",
}

const Layout = ({ children }: PropsWithChildren) => {
  return <ConfettiProvider>{children}</ConfettiProvider>
}

export default Layout
