import { pageBatchOptions } from "@/lib/options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGuildUrlName } from "./useGuildUrlName";

export const useSuspensePages = () => {
  const guildUrlName = useGuildUrlName();

  return useSuspenseQuery(pageBatchOptions({ guildIdLike: guildUrlName }));
};
