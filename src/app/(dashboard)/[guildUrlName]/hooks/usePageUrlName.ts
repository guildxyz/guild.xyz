import { useParams } from "next/navigation";

export const usePageUrlName = () =>
  useParams<{
    pageUrlName: string;
    guildUrlName: string;
  }>();
