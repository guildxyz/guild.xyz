import { fetchEntity, fetchUser } from "@/lib/fetchers";
import type { ErrorLike } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import { queryOptions } from "@tanstack/react-query";

export const entityOptions = <Data = object, Error = ErrorLike>({
  entity,
  idLike,
  ...rest
}: Parameters<typeof fetchEntity>[0]) => {
  return queryOptions<Data, Error>({
    queryKey: [entity, idLike],
    queryFn: () => fetchEntity({ entity, idLike, ...rest }),
  });
};

export const guildOptions = ({ idLike }: { idLike: string }) => {
  return entityOptions<Schemas["Guild"]>({
    entity: "guild",
    idLike,
  });
};

export const userOptions = () => {
  return queryOptions<Schemas["User"]>({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
  });
};
