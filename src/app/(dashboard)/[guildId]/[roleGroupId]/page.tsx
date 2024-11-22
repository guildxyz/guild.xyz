import { Card } from "@/components/ui/Card";
import { env } from "@/lib/env";
import type {
  DynamicRoute,
  Guild,
  PaginatedResponse,
  Role,
  RoleGroup,
} from "@/lib/types";

const RoleGroupPage = async ({
  params,
}: DynamicRoute<{ roleGroupId: string; guildId: string }>) => {
  const { roleGroupId: roleGroupIdParam, guildId: guildIdParam } = await params;
  const _guild = (await (
    await fetch(`${env.NEXT_PUBLIC_API}/guild/urlName/${guildIdParam}`)
  ).json()) as Guild;
  const paginatedRoleGroup = (await (
    await fetch(
      `${env.NEXT_PUBLIC_API}/role-group/search?custumQuery=@guildId:{${guildIdParam}}`,
    )
  ).json()) as PaginatedResponse<RoleGroup>;
  const roleGroups = paginatedRoleGroup.items;
  const roleGroup = roleGroups.find((rg) => rg.urlName === roleGroupIdParam);

  const paginatedRole = (await (
    await fetch(
      `${env.NEXT_PUBLIC_API}/role/search?custumQuery=@guildId:{${guildIdParam}} @roleGroupId:{${roleGroup}}`,
    )
  ).json()) as PaginatedResponse<Role>;
  const roles = paginatedRole.items;
  console.log(roles);

  return (
    <div className="my-4 space-y-4">
      {roles.map((role) => (
        <Card className="p-4" key={role.id}>
          <div className="flex items-center">
            <img
              className="size-12 rounded-full"
              src={role.imageUrl}
              alt="role avatar"
            />
            <h3 className="font-bold text-xl tracking-tight">{role.name}</h3>
          </div>
          <p className="">{role.description}</p>
        </Card>
      ))}
    </div>
  );
};

export default RoleGroupPage;
