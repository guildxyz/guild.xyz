"use client";

import { Button } from "@/components/ui/Button";
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
