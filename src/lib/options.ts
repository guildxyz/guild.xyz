import {
  fetchEntity,
  fetchPageBatch,
  fetchRewardBatch,
  fetchRoleBatch,
  fetchUser,
} from "@/lib/fetchers";
import type { WithId, WithIdLike } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

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

export const roleBatchOptions = ({
  pageIdLike,
  guildIdLike,
}: Partial<WithIdLike<"page">> & WithIdLike<"guild">) => {
  return queryOptions({
    queryKey: ["role", "batch", pageIdLike || "home", guildIdLike],
    queryFn: () => fetchRoleBatch({ pageIdLike, guildIdLike }),
  });
};

export const rewardBatchOptions = ({ roleId }: WithId<"role">) => {
  z.string().uuid().parse(roleId);
  return queryOptions({
    queryKey: ["reward", "batch", roleId],
    queryFn: () => fetchRewardBatch({ roleId }),
  });
};

export const userOptions = () => {
  return queryOptions<Schemas["User"]>({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
  });
};
