import { cn } from "@/lib/cssUtils";
import { SealCheck, Users } from "@phosphor-icons/react/dist/ssr";
import type { PropsWithChildren } from "react";

export const ProfileCard = ({
  className,
  ...props
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-whiteAlpha-medium bg-card-secondary p-4 transition-all hover:cursor-pointer hover:brightness-110",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-1">
        <p className="max-w-full items-center gap-1 truncate whitespace-nowrap font-bold text-lg">
          b4lnit
        </p>
        <SealCheck
          size={16}
          weight="fill"
          className="shrink-0 text-green-400"
        />
      </div>
      <small className="font-bold opacity-50">@b4lnit</small>
      <p className="my-4 opacity-50">Palm tree enthusiast</p>

      <div className="flex items-center gap-1">
        <Users size={16} weight="bold" />
        <p className="text-sm">
          <strong>1234</strong> <span className="opacity-50">Guildmates</span>
        </p>
      </div>
      <p className="text-sm">
        <strong>1234</strong> <span className="opacity-50">Followers</span>
      </p>
    </div>
  );
};
