import { Card } from "@/components/ui/Card";
import type { Leaderboard } from "@/lib/schemas/leaderboard";
import { User } from "@phosphor-icons/react/dist/ssr";

export const LeaderboardUserCard = ({
  user,
}: { user: Leaderboard["user"] }) => (
  <Card className="flex items-center">
    <div className="flex size-16 shrink-0 items-center justify-center border-r bg-blackAlpha px-2 font-display font-extrabold text-lg sm:size-24 dark:bg-blackAlpha-hard">
      {`#${user.rank}`}
    </div>

    <div className="flex w-full items-center justify-between gap-4 px-4 sm:px-5">
      <div className="flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-image sm:size-10">
          <User weight="duotone" className="size-4 sm:size-5" />
        </div>
        <span className="line-clamp-1 shrink font-bold">{user.userId}</span>
      </div>
      <span className="shrink-0">
        <b>{`${user.amount} `}</b>
        {/* TODO: display point' name */}
        {/* <span>point name</span> */}
      </span>
    </div>
  </Card>
);
