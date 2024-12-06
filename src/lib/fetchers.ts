import { fetchGuildApiData } from "@/lib/fetchGuildApi";
import { resolveIdLikeRequest } from "@/lib/resolveIdLikeRequest";
import { tryGetParsedToken } from "@/lib/token";
import type { Entity, EntitySchema, ErrorLike, WithIdLike } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import type { Role } from "./schemas/role";

export const fetchEntity = async <T extends Entity, Error = ErrorLike>({
  idLike,
  entity,
  responseInit,
}: {
  entity: T;
  idLike: string;
  responseInit?: Parameters<typeof fetch>[1];
}) => {
  const pathname = `${entity}/${resolveIdLikeRequest(idLike)}`;
  return fetchGuildApiData<EntitySchema<T>, Error>(pathname, responseInit);
};

export const fetchUser = async () => {
  const { userId } = await tryGetParsedToken();
  return fetchEntity({
    entity: "user",
    idLike: userId,
  });
};

export const fetchGuildLeave = async ({ guildId }: { guildId: string }) => {
  return fetchGuildApiData(`guild/${guildId}/leave`, {
    method: "POST",
  });
};

export const fetchPageBatch = async ({ guildIdLike }: WithIdLike<"guild">) => {
  const guild = await fetchEntity({ entity: "guild", idLike: guildIdLike });
  return fetchGuildApiData<Schemas["Page"][]>("page/batch", {
    method: "POST",
    body: JSON.stringify({ ids: guild.pages?.map((p) => p.pageId!) ?? [] }),
  });
};

export const fetchRoleBatch = async ({
  pageIdLike,
  guildIdLike,
}: WithIdLike<"page"> & WithIdLike<"guild">) => {
  const guild = await fetchEntity({ entity: "guild", idLike: guildIdLike });
  const isHomePageUrl = !pageIdLike;
  const pageIdLikeWithHome = isHomePageUrl ? guild.homePageId! : pageIdLike;
  const page = await fetchEntity({
    entity: "page",
    idLike: pageIdLikeWithHome,
  });

  return fetchGuildApiData<Role[]>("role/batch", {
    method: "POST",
    body: JSON.stringify({ ids: page.roles?.map((p) => p.roleId!) ?? [] }),
  });
};
