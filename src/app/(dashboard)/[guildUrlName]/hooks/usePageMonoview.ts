import { pageMonoviewOptions } from "@/lib/options";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const usePageMonoview = () => {
  const { pageUrlName: pageUrlNameParam, guildUrlName } = useParams<{
    pageUrlName: string;
    guildUrlName: string;
  }>();

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return useQuery<any>(
    pageMonoviewOptions({
      guildIdLike: guildUrlName,
      pageIdLike: pageUrlNameParam,
    }),
  );
};

export const usePageMonoviewSuspense = () => {
  const { pageUrlName: pageUrlNameParam, guildUrlName } = useParams<{
    pageUrlName: string;
    guildUrlName: string;
  }>();

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return useSuspenseQuery<any>(
    pageMonoviewOptions({
      guildIdLike: guildUrlName,
      pageIdLike: pageUrlNameParam,
    }),
  );
};
