import {
  fetchEntity,
  fetchPageBatch,
  fetchRoleBatch,
  fetchUser,
} from "@/lib/fetchers";
import type { WithIdLike } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import { queryOptions } from "@tanstack/react-query";

export const guildOptions = ({ guildIdLike }: WithIdLike<"guild">) => {
  return queryOptions({
    queryKey: ["guild", guildIdLike],
    queryFn: () => fetchEntity({ entity: "guild", idLike: guildIdLike }),
  });
};

export const pageBatchOptions = ({ guildIdLike }: WithIdLike<"guild">) => {
  return queryOptions({
    queryKey: ["page", "batch", guildIdLike],
    queryFn: () => fetchPageBatch({ guildIdLike }),
  });
};

export const roleBatchOptions = ({
  pageIdLike,
  guildIdLike,
}: Partial<WithIdLike<"page">> & WithIdLike<"guild">) => {
  return queryOptions({
    queryKey: ["role", "batch", pageIdLike || "home", guildIdLike],
    queryFn: () => fetchRoleBatch({ pageIdLike, guildIdLike }),
  });
};

export const userOptions = () => {
  return queryOptions<Schemas["User"]>({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
    retry: false,
  });
};
