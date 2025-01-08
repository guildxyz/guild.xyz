import { roleBatchOptions } from "@/lib/options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePageUrlName } from "./usePageUrlName";

export const useSuspenseRoles = () => {
  const { guildUrlName, pageUrlName } = usePageUrlName();

  return useSuspenseQuery(
    roleBatchOptions({
      guildIdLike: guildUrlName,
      pageIdLike: pageUrlName,
    }),
  );
};
