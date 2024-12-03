import { tryGetParsedToken } from "@/actions/auth";
import { fetchGuildApiAuthData, fetchGuildApiData } from "@/lib/fetchGuildApi";
import type { ErrorLike, WithIdLike } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import z from "zod";

const resolveIdLikeRequest = (idLike: string) => {
  const isId = z.string().uuid().safeParse(idLike).success;
  return `${isId ? "id" : "urlName"}/${idLike}`;
};

export const leaveGuild = async ({ guildId }: { guildId: string }) => {
  return fetchGuildApiAuthData(`guild/${guildId}/leave`, {
    method: "POST",
  });
};

export const getGuild = async ({ idLike }: WithIdLike) => {
  return fetchGuildApiData<Schemas["GuildFull"]>(
    `guild/${resolveIdLikeRequest(idLike)}`,
  );
};

export const getEntity = async <Data = object, Error = ErrorLike>({
  idLike,
  entity,
  responseInit,
  auth = false,
}: {
  entity: string;
  idLike: string;
  auth?: boolean;
  responseInit?: Parameters<typeof fetch>[1];
}) => {
  const pathname = `${entity}/${resolveIdLikeRequest(idLike)}`;
  return auth
    ? fetchGuildApiAuthData<Data, Error>(pathname, responseInit)
    : fetchGuildApiData<Data, Error>(pathname, responseInit);
};

export const getUser = async () => {
  const { userId } = await tryGetParsedToken();
  return getEntity<Schemas["UserFull"]>({
    entity: "user",
    idLike: userId,
    auth: true,
  });
};

export const getPages = async ({ guildId }: { guildId: string }) => {
  const guild = await getGuild({ idLike: guildId });
  return fetchGuildApiData<Schemas["PageFull"][]>("page/batch", {
    method: "POST",
    body: JSON.stringify({ ids: guild.pages?.map((p) => p.pageId!) ?? [] }),
  });
};
