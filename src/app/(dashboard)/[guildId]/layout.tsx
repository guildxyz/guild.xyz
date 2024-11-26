import { DashboardContainer } from "@/components/DashboardContainer";
import { Button } from "@/components/ui/Button";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { env } from "@/lib/env";
import type { Guild } from "@/lib/schemas/guild";
import type { RoleGroup } from "@/lib/schemas/roleGroup";
import type { DynamicRoute, PaginatedResponse } from "@/lib/types";
import type { PropsWithChildren } from "react";
import { RoleGroupNavLink } from "./_components/RoleGroupNavLink";

const GuildPage = async ({
  params,
  children,
}: PropsWithChildren<DynamicRoute<{ guildId: string }>>) => {
  const { guildId: guildIdParam } = await params;
  const guild = (await (
    await fetch(`${env.NEXT_PUBLIC_API}/guild/urlName/${guildIdParam}`)
  ).json()) as Guild;
  const paginatedRoleGroup = (await (
    await fetch(
      `${env.NEXT_PUBLIC_API}/role-group/search?customQuery=@guildId:{${guild.id}}`,
    )
  ).json()) as PaginatedResponse<RoleGroup>;
  const roleGroups = paginatedRoleGroup.items;

  return (
    <DashboardContainer>
      <main className="py-16">
        <div className="flex flex-col items-stretch md:flex-row md:justify-between">
          <div className="w-full space-y-4">
            <div className="flex w-full flex-col items-stretch justify-between gap-8 md:flex-row md:items-center">
              <div className="flex max-w-prose items-center gap-4">
                <img
                  src={guild.imageUrl}
                  className="size-20 rounded-full border"
                  alt="avatar"
                />
                <h1 className="text-pretty font-bold font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
                  {guild.name}
                </h1>
              </div>
              <Button colorScheme="success" size="lg">
                Join Guild
              </Button>
            </div>
            <p className="line-clamp-3 max-w-prose text-balance text-lg leading-relaxed">
              {guild.description}
            </p>
          </div>
        </div>

        <ScrollArea>
          <div className="mt-32 mb-3 flex gap-3">
            {roleGroups.map((rg) => (
              <RoleGroupNavLink
                key={rg.id}
                tab={{
                  path: `/${guildIdParam}/${rg.urlName}`,
                  segment: rg.urlName,
                  label: rg.name,
                }}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {children}
      </main>
    </DashboardContainer>
  );
};

export default GuildPage;
