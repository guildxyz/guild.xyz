import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Users } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { FunctionComponent } from "react";

export const GuildCard: FunctionComponent<{ guild: Guild }> = ({ guild }) => {
  return (
    <Link
      href={`/${guild.urlName}`}
      className="rounded-2xl outline-none focus-visible:ring-4"
    >
      <Card className="relative grid grid-cols-[theme(space.12)_1fr] grid-rows-2 items-center gap-x-4 gap-y-0.5 overflow-hidden rounded-2xl px-6 py-7 shadow-md before:absolute before:inset-0 before:bg-black/5 before:opacity-0 before:transition-opacity before:duration-200 before:content-[''] hover:before:opacity-55 active:before:opacity-85 dark:before:bg-white/5">
        <div className="row-span-2 grid size-12 place-items-center rounded-full bg-image text-white">
          <img src={guild.imageUrl} className="size-6" alt="guild avatar" />
          {/*<ImageSquare weight="duotone" className="size-6" />*/}
        </div>

        <h3 className="line-clamp-1 font-black font-display text-lg">
          {guild.name}
        </h3>
        <div className="flex flex-wrap gap-1">
          <Badge>
            <Users className="size-4" />
            <span>
              {new Intl.NumberFormat("en", {
                notation: "compact",
              }).format(12345)}
            </span>
          </Badge>

          <Badge>5 groups</Badge>
        </div>
      </Card>
    </Link>
  );
};
