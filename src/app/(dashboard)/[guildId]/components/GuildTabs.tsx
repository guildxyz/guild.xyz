import { Card } from "@/components/ui/Card";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cssUtils";
import type { Guild } from "@/lib/schemas/guild";
import { getRoleGroups } from "../fetchers";
import { CreateRoleGroup } from "./CreateRoleGroup";
import { RoleGroupNavLink } from "./RoleGroupNavLink";

type Props = {
  guild: Guild;
};

export const GuildTabs = async ({ guild }: Props) => {
  const roleGroups = await getRoleGroups(guild.id);

  return (
    <ScrollArea
      className="-ml-8 w-[calc(100%+theme(space.8))]"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 32px, black calc(100% - 32px), transparent 100%)",
      }}
    >
      <div className="my-4 flex gap-3 px-8">
        <RoleGroupNavLink href={`/${guild.urlName}`}>Home</RoleGroupNavLink>
        {roleGroups.map((rg) => (
          <RoleGroupNavLink
            key={rg.id}
            href={`/${guild.urlName}/${rg.urlName}`}
          >
            {rg.name}
          </RoleGroupNavLink>
        ))}
        <CreateRoleGroup guildId={guild.id} />
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
        // biome-ignore lint: it's safe to use index as key in this case
        key={i}
        className={cn("flex h-11 items-center px-4", SKELETON_SIZES[i])}
      >
        <Skeleton className="h-4 w-full" />
      </Card>
    ))}
  </div>
);
