import type { ErrorLike } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import { queryOptions } from "@tanstack/react-query";
import { getEntity, getUser } from "./actions";

export const entityOptions = <Data = object, Error = ErrorLike>({
  entity,
  idLike,
  ...rest
}: Parameters<typeof getEntity>[0]) => {
  return queryOptions<Data, Error>({
    queryKey: [entity, idLike],
    queryFn: () => getEntity({ entity, idLike, ...rest }),
  });
};

export const guildOptions = ({ idLike }: { idLike: string }) => {
  return entityOptions<Schemas["GuildFull"]>({
    entity: "guild",
    idLike,
  });
};

export const userOptions = () => {
  return queryOptions<Schemas["UserFull"]>({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });
};
