import { PropsWithChildren } from "react"

export const Root = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-screen flex-col">{children}</div>
)
