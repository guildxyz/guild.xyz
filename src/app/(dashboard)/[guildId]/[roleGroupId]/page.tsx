import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { env } from "@/lib/env";
import type { Guild } from "@/lib/schemas/guild";
import type { Role } from "@/lib/schemas/role";
import type { RoleGroup } from "@/lib/schemas/roleGroup";
import type { DynamicRoute, PaginatedResponse } from "@/lib/types";
import { Lock } from "@phosphor-icons/react/dist/ssr";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Fragment } from "react";

const RoleGroupPage = async ({
  params,
}: DynamicRoute<{ roleGroupId: string; guildId: string }>) => {
  const { roleGroupId: roleGroupIdParam, guildId: guildIdParam } = await params;
  const guild = (await (
    await fetch(`${env.NEXT_PUBLIC_API}/guild/urlName/${guildIdParam}`)
  ).json()) as Guild;
  const paginatedRoleGroup = (await (
    await fetch(
      `${env.NEXT_PUBLIC_API}/role-group/search?customQuery=@guildId:{${guild.id}}&pageSize=${Number.MAX_SAFE_INTEGER}`,
    )
  ).json()) as PaginatedResponse<RoleGroup>;
  const roleGroups = paginatedRoleGroup.items;
  const roleGroup = roleGroups.find((rg) => rg.urlName === roleGroupIdParam)!;
  const paginatedRole = (await (
    await fetch(
      `${env.NEXT_PUBLIC_API}/role/search?customQuery=@guildId:{${guild.id}}&pageSize=${Number.MAX_SAFE_INTEGER}`,
    )
  ).json()) as PaginatedResponse<Role>;
  const roles = paginatedRole.items.filter((r) => r.groupId === roleGroup.id);

  return (
    <div className="my-4 space-y-4">
      {roles.map((role) => (
        <Card className="flex border" key={role.id}>
          <div className="w-1/2 border-r-2 p-6">
            <div className="flex items-center gap-3">
              <img
                className="size-14 rounded-full border"
                src={role.imageUrl ?? ""} // TODO: fallback image
                alt="role avatar"
              />
              <h3 className="font-bold text-xl tracking-tight">{role.name}</h3>
            </div>
            <p className="mt-4 leading-relaxed">{role.description}</p>
          </div>
          <div className="w-1/2 bg-background p-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground-secondary text-xs">
                REQUIREMENTS
              </span>
              <Button size="sm">
                <Lock />
                Join Guild to collect rewards
              </Button>
            </div>
            <ScrollArea className="mt-6 h-32">
              <div className="flex flex-col gap-6">
                {Array.from({ length: 16 }, (_, i) => (
                  <Fragment key={i}>
                    {i > 0 && <div className="h-px w-full bg-border" />}
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-image" />
                      <div className="">
                        <h4 className="font-medium">Requirement name</h4>
                        <p className="text-foreground-secondary text-sm">
                          description, additional info
                        </p>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </ScrollArea>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RoleGroupPage;
