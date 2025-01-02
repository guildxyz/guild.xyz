"use client";

import { IconButton } from "@/components/ui/IconButton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { fetchGuildLeave } from "@/lib/fetchers";
import { userOptions } from "@/lib/options";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGuild } from "../hooks/useGuild";

export const LeaveGuild = () => {
  const guild = useGuild();
  const queryClient = useQueryClient();

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
        <IconButton
          aria-label="Leave guild"
          className="size-11 rounded-full"
          onClick={() => mutate()}
          isLoading={isPending}
          icon={<SignOut weight="bold" />}
        />
      </TooltipTrigger>

      <TooltipContent>
        <p>Leave guild</p>
      </TooltipContent>
    </Tooltip>
  );
};
