import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Leaderboard } from "@/lib/schemas/leaderboard";
import { User } from "@phosphor-icons/react/dist/ssr";
import { useSuspensePointReward } from "../hooks/useSuspensePointReward";

export const LeaderboardUserCard = ({
  user,
}: { user: NonNullable<Leaderboard["user"]> }) => {
  const { data: pointReward } = useSuspensePointReward();

  return (
    <Card className="flex items-center">
      <div className="flex size-16 shrink-0 items-center justify-center border-r bg-blackAlpha px-2 font-display font-extrabold text-lg sm:size-24 dark:bg-blackAlpha-hard">
        {`#${user.rank}`}
      </div>

      <div className="flex w-full items-center justify-between gap-4 px-4 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-image sm:size-10">
            <User weight="duotone" className="size-4 sm:size-5" />
          </div>
          <span className="line-clamp-1 shrink font-bold">
            {user.primaryIdentity?.foreignId ?? "Unknown user"}
          </span>
        </div>
        <span className="shrink-0">
          <b>{`${user.amount} `}</b>
          <span>{pointReward.data.name}</span>
        </span>
      </div>
    </Card>
  );
};

export const LeaderboardUserCardSkeleton = () => (
  <Card className="flex items-center">
    <div className="flex size-16 shrink-0 items-center justify-center border-r bg-blackAlpha px-2 font-display font-extrabold text-lg sm:size-24 dark:bg-blackAlpha-hard">
      <Skeleton className="size-6 sm:size-8" />
    </div>

    <div className="flex w-full items-center justify-between gap-4 px-4 sm:px-5">
      <div className="flex grow items-center gap-2">
        <Skeleton className="size-8 shrink-0 rounded-full sm:size-10" />
        <Skeleton className="h-4 w-1/2 sm:h-5" />
      </div>
      <Skeleton className="h-4 w-16 sm:h-5" />
    </div>
  </Card>
);
