import { pageMonoviewOptions } from "@/lib/options";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const usePageMonoview = () => {
  const { pageUrlName: pageUrlNameParam, guildUrlName } = useParams<{
    pageUrlName: string;
    guildUrlName: string;
  }>();

  return useQuery(
    pageMonoviewOptions({
      guildIdLike: guildUrlName,
      pageIdLike: pageUrlNameParam,
    }),
  );
};
