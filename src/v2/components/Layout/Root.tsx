import { PropsWithChildren } from "react"

type Props = PropsWithChildren

function Root({ children }: Props) {
  return <div className="relative min-h-screen flex flex-col">{children}</div>
}

export default Root
