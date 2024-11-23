import { env } from "@/lib/env";
import type {
  DynamicRoute,
  Guild,
  PaginatedResponse,
  RoleGroup,
} from "@/lib/types";
import { redirect } from "next/navigation";

const DefaultGuildPage = async ({
  params,
}: DynamicRoute<{ guildId: string }>) => {
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
  const roleGroup = roleGroups.at(0);
  if (roleGroup) {
    redirect(`/${guildIdParam}/${roleGroup.urlName}`);
  }
  return "default guild page";
};

export default DefaultGuildPage;
