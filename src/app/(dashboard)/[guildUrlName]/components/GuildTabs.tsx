import { Card } from "@/components/ui/Card";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cssUtils";
import type { Schemas } from "@guildxyz/types";
import { getPages } from "../actions";
import { PageNavLink } from "./RoleGroupNavLink";

const roleGroupOrder = ["Home", "Admin"].reverse();

export const GuildTabs = async ({ guild }: { guild: Schemas["GuildFull"] }) => {
  const pages = await getPages({ guildId: guild.id });

  return (
    <ScrollArea
      className="-ml-8 w-[calc(100%+theme(space.8))]"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 32px, black calc(100% - 32px), transparent 100%)",
      }}
    >
      <div className="my-4 flex gap-3 px-8">
        {pages
          .sort((a, b) => {
            const [aIndex, bIndex] = [a, b].map((val) =>
              roleGroupOrder.findIndex((pred) => pred === val.name),
            );
            return bIndex - aIndex;
          })
          .map((rg) => (
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
