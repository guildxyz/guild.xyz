import { Card } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"
import { Skeleton } from "@/components/ui/Skeleton"

export const ProfileMainSkeleton = () => (
  <div>
    <Skeleton className="mb-3 h-8 w-40" />
    <div className="mb-16 grid grid-cols-1 gap-3 md:grid-cols-2">
      <Card>
        <Skeleton className="size-full h-44" />
      </Card>
      <Card>
        <Skeleton className="size-full" />
      </Card>
    </div>
    <Skeleton className="mb-3 h-8 w-40" />
    <div className="mb-16 grid grid-cols-1 gap-3 md:grid-cols-2">
      <Card>
        <Skeleton className="size-full h-44" />
      </Card>
      <Card>
        <Skeleton className="size-full h-44" />
      </Card>
      <Card>
        <Skeleton className="size-full h-44" />
      </Card>
      <Card>
        <Skeleton className="size-full" />
      </Card>
    </div>
  </div>
)

export const ProfileHeroSkeleton = () => (
  <div className="relative my-24 flex flex-col items-center">
    <div className="relative mb-12 flex items-center justify-center">
      <Skeleton className="size-48 rounded-full" />
    </div>
    <Skeleton className="my-2 h-8 w-96" />
    <div className="text-lg text-muted-foreground"></div>
    <p className="mt-6 max-w-md text-pretty text-center text-lg text-muted-foreground"></p>
    <div className="mt-8 grid grid-cols-[repeat(3,auto)] gap-x-8 gap-y-6 sm:grid-cols-[repeat(5,auto)]">
      <div className="flex flex-col items-center leading-tight">
        <Skeleton className="mb-2 h-5 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Separator orientation="vertical" className="h-12" />
      <div className="flex flex-col items-center leading-tight">
        <Skeleton className="mb-2 h-5 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Separator orientation="vertical" className="hidden h-12 sm:block" />
      <div className="col-span-3 flex items-center gap-2 place-self-center sm:col-span-1">
        <Skeleton className="mb-1 h-12 w-32" />
      </div>
    </div>
  </div>
)
