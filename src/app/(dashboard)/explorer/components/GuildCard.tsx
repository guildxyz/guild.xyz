import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Guild } from "@/lib/schemas/guild";
import { ImageSquare, Users } from "@phosphor-icons/react/dist/ssr";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import type { FunctionComponent } from "react";

export const GuildCard: FunctionComponent<{ guild: Guild }> = ({ guild }) => {
  return (
    <Link
      href={`/${guild.urlName}`}
      className="relative rounded-2xl outline-none focus-visible:ring-4"
    >
      <Card className="relative grid grid-cols-[theme(space.12)_1fr] grid-rows-2 items-center gap-x-4 gap-y-0.5 overflow-hidden rounded-2xl px-6 py-7 shadow-md before:absolute before:inset-0 before:bg-black/5 before:opacity-0 before:transition-opacity before:duration-200 before:content-[''] hover:before:opacity-55 active:before:opacity-85 dark:before:bg-white/5">
        <Avatar className="row-span-2 grid size-12 place-items-center overflow-hidden rounded-full bg-image text-white">
          <AvatarImage
            src={
              !!guild.imageUrl && !guild.imageUrl.startsWith("/guildLogos")
                ? guild.imageUrl
                : undefined
            }
            className="size-full"
            alt="guild avatar"
          />
          <AvatarFallback>
            <ImageSquare weight="duotone" className="size-6" />
          </AvatarFallback>
        </Avatar>

        <h3 className="line-clamp-1 font-black font-display text-lg">
          {guild.name}
        </h3>
        <div className="flex flex-wrap gap-1">
          <Badge>
            <Users className="size-4" />
            <span>
              {new Intl.NumberFormat("en", {
                notation: "compact",
              }).format(guild.memberCount)}
            </span>
          </Badge>

          <Badge>{`${guild.roleCount} role${guild.roleCount > 1 ? "s" : ""}`}</Badge>
        </div>
      </Card>
    </Link>
  );
};

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
