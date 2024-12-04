"use client";

import { Card } from "@/components/ui/Card";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cssUtils";
import { guildOptions, pageBatchOptions } from "@/lib/options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { PageNavLink } from "./RoleGroupNavLink";

export const GuildTabs = () => {
  const { guildUrlName } = useParams<{ guildUrlName: string }>();
  const { data: guild } = useSuspenseQuery(
    guildOptions({ guildIdLike: guildUrlName }),
  );
  const { data: pages } = useSuspenseQuery(
    pageBatchOptions({ guildIdLike: guildUrlName }),
  );

  return (
    <ScrollArea
      className="-ml-8 w-[calc(100%+theme(space.8))]"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 32px, black calc(100% - 32px), transparent 100%)",
      }}
    >
      <div className="my-4 flex gap-3 px-8">
        {pages.map((rg) => (
          <PageNavLink
            key={rg.id}
            href={[guild.urlName, rg.urlName]
              .filter(Boolean)
              .map((s) => `/${s}`)
              .join("")}
          >
            {rg.name}
          </PageNavLink>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="hidden" />
    </ScrollArea>
  );
};

const SKELETON_SIZES = ["w-20", "w-36", "w-28"];
export const GuildTabsSkeleton = () => (
  <div className="my-4 flex gap-3">
    {[...Array(3)].map((_, i) => (
      <Card
        key={`${SKELETON_SIZES[i]}${i}`}
        className={cn("flex h-11 items-center px-4", SKELETON_SIZES[i])}
      >
        <Skeleton className="h-4 w-full" />
      </Card>
    ))}
  </div>
);
