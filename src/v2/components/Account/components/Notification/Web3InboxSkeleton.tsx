import { Skeleton } from "@/components/ui/Skeleton"

export const Web3InboxSkeleton = () => (
  <div className="my-2 grid h-10 grid-cols-[auto_1fr] grid-rows-2 gap-2 space-x-2 px-4">
    <Skeleton className="row-span-2 aspect-square h-full rounded-full" />
    <Skeleton />
    <Skeleton className="w-10/12" />
  </div>
)
