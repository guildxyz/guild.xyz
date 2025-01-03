import { useParams } from "next/navigation";

export const useGuildUrlName = () => {
  const { guildUrlName } = useParams<{ guildUrlName: string }>();

  return guildUrlName;
};
