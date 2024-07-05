import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export const AccountSectionTitle = ({
  title,
  titleRightElement,
}: {
  title: string
  titleRightElement?: ReactNode
}) => (
  <div className="mb-3 flex w-full items-center">
    <span className="text-sm font-bold text-muted-foreground">{title}</span>
    {titleRightElement}
  </div>
)

export const AccountSection = ({
  className,
  children,
}: {
  children: ReactNode
  className?: string
}) => (
  <div
    className={cn(
      "flex flex-col gap-3 rounded-xl border bg-card-secondary px-4 py-3.5",
      className
    )}
  >
    {children}
  </div>
)
