"use client";

import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { fetchGuildLeave } from "@/lib/fetchers";
import { guildOptions, userOptions } from "@/lib/options";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGuildUrlName } from "../hooks/useGuildUrlName";

export const LeaveGuild = () => {
  const guildUrlName = useGuildUrlName();
  const guild = useQuery(guildOptions({ guildIdLike: guildUrlName }));
  const queryClient = useQueryClient();

  if (!guild.data) {
    throw new Error("Failed to fetch guild");
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () => fetchGuildLeave({ guildId: guild.data.id }),
    onSuccess: async () => {
      const prev = queryClient.getQueryData(userOptions().queryKey);
      if (prev) {
        queryClient.setQueryData(userOptions().queryKey, {
          ...prev,
          guilds: prev?.guilds?.filter(
            ({ guildId }) => guildId !== guild.data.id,
          ),
        });
      }
    },
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* TODO: IconButton component */}
        <Button
          className="size-11 rounded-full"
          onClick={() => mutate()}
          isLoading={isPending}
          leftIcon={<SignOut weight="bold" />}
        />
      </TooltipTrigger>

      <TooltipContent>
        <p>Leave guild</p>
      </TooltipContent>
    </Tooltip>
  );
};
