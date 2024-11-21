import { Skeleton } from "@/components/ui/Skeleton";

export const GuildCardSkeleton = () => {
  return (
    <div className="grid grid-cols-[theme(space.14)_1fr] items-center gap-4 rounded-2xl bg-card px-5 py-6 shadow-md">
      <Skeleton className="size-14 rounded-full" />

      <div className="grid gap-1.5">
        <Skeleton className="h-6 w-3/4" />

        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
};
