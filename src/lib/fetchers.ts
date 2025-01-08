import { fetchGuildApiData } from "@/lib/fetchGuildApi";
import { resolveIdLikeRequest } from "@/lib/resolveIdLikeRequest";
import type {
  Entity,
  EntitySchema,
  ErrorLike,
  WithId,
  WithIdLike,
} from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import { z } from "zod";
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
  return fetchGuildApiData<Schemas["User"]>("auth/me");
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
}: Partial<WithIdLike<"page">> & WithIdLike<"guild">) => {
  const isHomePageUrl = !pageIdLike;
  let pageIdLikeWithHome = pageIdLike;
  if (isHomePageUrl) {
    const { homePageId } = await fetchEntity({
      entity: "guild",
      idLike: guildIdLike,
    });
    pageIdLikeWithHome = homePageId!;
  }

  const page = await fetchEntity({
    entity: "page",
    idLike: pageIdLikeWithHome!,
  });

  return fetchGuildApiData<Role[]>("role/batch", {
    method: "POST",
    body: JSON.stringify({ ids: page.roles?.map((p) => p.roleId!) ?? [] }),
  });
};

export const fetchRewardBatch = async ({ roleId }: WithId<"role">) => {
  z.string().uuid().parse(roleId);
  const role = await fetchEntity({ entity: "role", idLike: roleId });
  return fetchGuildApiData<Schemas["Reward"][]>("reward/batch", {
    method: "POST",
    body: JSON.stringify({
      ids: role.rewards?.map((r) => r.rewardId!) ?? [],
    }),
  });
};
