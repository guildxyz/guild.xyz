import { fetchEntity, fetchPageBatch, fetchUser } from "@/lib/fetchers";
import type { WithIdLike } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import { queryOptions } from "@tanstack/react-query";

export const entityOptions = ({
  entity,
  idLike,
  ...rest
}: Parameters<typeof fetchEntity>[0]) => {
  return queryOptions({
    queryKey: [entity, idLike],
    queryFn: () => fetchEntity({ entity, idLike, ...rest }),
  });
};

export const guildOptions = ({ guildIdLike }: WithIdLike<"guild">) => {
  return entityOptions({
    entity: "guild",
    idLike: guildIdLike,
  });
};

export const pageBatchOptions = ({ guildIdLike }: WithIdLike<"guild">) => {
  return queryOptions({
    queryKey: ["page", "batch", guildIdLike],
    queryFn: () => fetchPageBatch({ guildIdLike }),
  });
};

export const userOptions = () => {
  return queryOptions<Schemas["User"]>({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
  });
};
