import { PropsWithChildren } from "react"
import { PageBoundary } from "../PageBoundary"

export const Main = ({ children }: PropsWithChildren) => (
  <main>
    <PageBoundary>{children}</PageBoundary>
  </main>
)
