import type { DynamicRoute } from "@/lib/types";
import { getGuild } from "./fetchers";

const DefaultGuildPage = async ({
  params,
}: DynamicRoute<{ guildId: string }>) => {
  const { guildId: urlName } = await params;
  const guild = await getGuild(urlName);
  // const paginatedRoleGroup = (await (
  //   await fetch(
  //     `${env.NEXT_PUBLIC_API}/role-group/search?customQuery=@guildId:{${guild.id}}`,
  //   )
  // ).json()) as PaginatedResponse<RoleGroup>;
  // const roleGroups = paginatedRoleGroup.items;
  // const roleGroup = roleGroups.at(0);
  // if (roleGroup) {
  //   redirect(`/${guildIdParam}/${roleGroup.urlName}`);
  // }
  return `Default guild page - ${guild.name}`;
};

export default DefaultGuildPage;
