import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cssUtils";
import { Clock, Lightning, Star } from "@phosphor-icons/react/dist/ssr";
import { cva } from "class-variance-authority";
import Link from "next/link";
import type { PropsWithChildren } from "react";

export const RewardCard = ({
  className,
  ...props
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl bg-card-secondary p-3 transition-colors hover:cursor-pointer hover:bg-card",
        className,
      )}
      {...props}
    >
      <Link href="#" className="absolute top-5 right-5 w-fit">
        <Badge
          size="lg"
          className="mb-2 whitespace-normal rounded-full text-sm backdrop-blur-md transition-colors hover:bg-black/10 dark:hover:bg-white/10"
        >
          Guild
        </Badge>
      </Link>
      <div className="mb-3 aspect-square w-full rounded-xl bg-whiteAlpha-medium"></div>

      <div className="flex flex-col px-1">
        <small className="m-0 font-bold opacity-50">Token</small>
        <p className="m-0 font-bold">Top Hunters</p>

        <RewardBadge variant="QuickGrab" className="mt-3" />
      </div>
    </div>
  );
};

const RewardBadge = ({
  variant,
  className,
}: {
  variant: "QuickGrab" | "SteadyUnlock" | "Exclusive";
  className?: string;
}) => {
  const rewardBadgeVariants = cva(
    "rounded-full text-sm font-semibold flex items-center gap-1 pr-3",
    {
      variants: {
        variant: {
          QuickGrab: "bg-yellow-600",
          SteadyUnlock: "bg-blue-500",
          Exclusive: "bg-red-500",
        },
      },
      defaultVariants: {
        variant: "QuickGrab",
      },
    },
  );

  const variantConfig = {
    QuickGrab: { text: "Quick Grab", icon: Lightning },
    SteadyUnlock: { text: "Steady Unlock", icon: Clock },
    Exclusive: { text: "Exclusive", icon: Star },
  };

  const Icon = variantConfig[variant].icon;

  return (
    <Badge
      size="lg"
      className={cn(rewardBadgeVariants({ variant, className }))}
    >
      <Icon size={14} weight="fill" />
      {variantConfig[variant].text}
    </Badge>
  );
};
