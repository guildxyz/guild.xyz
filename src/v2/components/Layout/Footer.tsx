import { PropsWithChildren } from "react"
import { PageBoundary } from "../PageBoundary"

export const Footer = ({ children }: PropsWithChildren) => (
  <footer className="mt-auto">
    <PageBoundary>{children}</PageBoundary>
  </footer>
)
