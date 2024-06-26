import clsx from "clsx"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  className?: string
}>

export function PageBoundary({ children, className }: Props) {
  return (
    <div
      className={clsx("mx-auto max-w-screen-lg px-4 sm:px-8 md:px-10", className)}
    >
      {children}
    </div>
  )
}
