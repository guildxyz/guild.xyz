import clsx from "clsx"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  balance?: boolean
  className?: string
}>

export function PageBoundary({ children, balance = false, className }: Props) {
  return (
    <div
      className={clsx(
        balance
          ? "-ml-[calc((100vw-1024px)/2)]"
          : "mx-auto max-w-screen-lg px-4 sm:px-8 md:px-10",
        className
      )}
    >
      {children}
    </div>
  )
}
