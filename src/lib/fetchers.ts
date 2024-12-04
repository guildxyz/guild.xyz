import { fetchGuildApiData } from "@/lib/fetchGuildApi";
import { resolveIdLikeRequest } from "@/lib/resolveIdLikeRequest";
import { tryGetParsedToken } from "@/lib/token";
import type { ErrorLike, WithIdLike } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";

export const fetchGuildLeave = async ({ guildId }: { guildId: string }) => {
  return fetchGuildApiData(`guild/${guildId}/leave`, {
    method: "POST",
  });
};

export const fetchGuild = async ({ idLike }: WithIdLike) => {
  return fetchGuildApiData<Schemas["GuildFull"]>(
    `guild/${resolveIdLikeRequest(idLike)}`,
  );
};

export const fetchEntity = async <Data = object, Error = ErrorLike>({
  idLike,
  entity,
  responseInit,
}: {
  entity: string;
  idLike: string;
  responseInit?: Parameters<typeof fetch>[1];
}) => {
  const pathname = `${entity}/${resolveIdLikeRequest(idLike)}`;
  return fetchGuildApiData<Data, Error>(pathname, responseInit);
};

export const fetchUser = async () => {
  const { userId } = await tryGetParsedToken();
  return fetchEntity<Schemas["UserFull"]>({
    entity: "user",
    idLike: userId,
  });
};

export const fetchPages = async ({ guildId }: { guildId: string }) => {
  const guild = await fetchGuild({ idLike: guildId });
  return fetchGuildApiData<Schemas["PageFull"][]>("page/batch", {
    method: "POST",
    body: JSON.stringify({ ids: guild.pages?.map((p) => p.pageId!) ?? [] }),
  });
};
