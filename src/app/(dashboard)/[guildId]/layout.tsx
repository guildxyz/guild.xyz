import { GuildImage } from "@/components/GuildImage";
import { Button } from "@/components/ui/Button";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { env } from "@/lib/env";
import type { Guild } from "@/lib/schemas/guild";
import type { RoleGroup } from "@/lib/schemas/roleGroup";
import type { DynamicRoute, PaginatedResponse } from "@/lib/types";
import type { PropsWithChildren } from "react";
import { CreateRoleGroup } from "./components/CreateRoleGroup";
import { RoleGroupNavLink } from "./components/RoleGroupNavLink";

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
    <main className="py-16">
      <div className="flex flex-col items-stretch pb-4 md:flex-row md:justify-between">
        <div className="w-full space-y-4">
          <div className="flex w-full flex-col items-stretch justify-between gap-8 md:flex-row md:items-center">
            <div className="flex max-w-prose items-center gap-4">
              <GuildImage
                name={guild.name}
                imageUrl={guild.imageUrl}
                className="size-20 rounded-full border"
              />
              <h1 className="text-pretty font-bold font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
                {guild.name}
              </h1>
            </div>
            <Button colorScheme="success" className="rounded-2xl">
              Join Guild
            </Button>
          </div>
          <p className="line-clamp-3 max-w-prose text-balance text-lg leading-relaxed">
            {guild.description}
          </p>
        </div>
      </div>

      <ScrollArea
        className="-ml-8 w-[calc(100%+theme(space.8))]"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 32px, black calc(100% - 32px), transparent 100%)",
        }}
      >
        <div className="my-4 flex gap-3 px-8">
          <RoleGroupNavLink href={`/${guildIdParam}`}>Home</RoleGroupNavLink>
          {roleGroups.map((rg) => (
            <RoleGroupNavLink
              key={rg.id}
              href={`/${guildIdParam}/${rg.urlName}`}
            >
              {rg.name}
            </RoleGroupNavLink>
          ))}
          <CreateRoleGroup guildId={guild.id} />
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
      {children}
    </main>
  );
};

export default GuildPage;
