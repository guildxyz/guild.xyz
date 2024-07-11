import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    // TODO: bg-muted is not usable here, because it is white in light mode...
    <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
  )
}

export { Skeleton }
