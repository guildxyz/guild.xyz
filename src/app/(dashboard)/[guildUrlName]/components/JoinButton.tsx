"use client";

import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { env } from "@/lib/env";
import { fetchGuildLeave } from "@/lib/fetchers";
import { getCookieClientSide } from "@/lib/getCookieClientSide";
import { guildOptions, userOptions } from "@/lib/options";
import type { Schemas } from "@guildxyz/types";
import { CheckCircle, SignOut } from "@phosphor-icons/react/dist/ssr";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventSourcePlus } from "event-source-plus";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const JoinButton = () => {
  const { guildUrlName } = useParams<{ guildUrlName: string }>();
  const user = useQuery(userOptions());
  const guild = useQuery(guildOptions({ guildIdLike: guildUrlName }));
  const queryClient = useQueryClient();

  if (!guild.data) {
    throw new Error("Failed to fetch guild");
  }

  const isJoined = !!user.data?.guilds?.some(
    ({ guildId }) => guildId === guild.data.id,
  );

  const joinMutation = useMutation({
    mutationFn: async () => {
      //TODO: Handle error here, throw error in funciton if needed
      const token = getCookieClientSide(GUILD_AUTH_COOKIE_NAME)!;
      const url = new URL(
        `api/guild/${guild.data.id}/join`,
        env.NEXT_PUBLIC_API,
      );
      const eventSource = new EventSourcePlus(url.toString(), {
        retryStrategy: "on-error",
        method: "post",
        maxRetryCount: 0,
        headers: {
          "x-auth-token": token,
          "content-type": "application/json",
        },
      });

      const { resolve, reject, promise } =
        Promise.withResolvers<Schemas["User"]>();
      eventSource.listen({
        onMessage: (sseMessage) => {
          try {
            const { status, message, data } = JSON.parse(
              sseMessage.data,
              // biome-ignore lint/suspicious/noExplicitAny: TODO: fill missing types
            ) as any;
            if (status === "Completed") {
              if (data === undefined) {
                throw new Error(
                  "Server responded with success, but returned no user",
                );
              }
              resolve(data);
            } else if (status === "error") {
              reject();
            }

            toast(status, {
              description: message,
              icon:
                status === "Completed" ? (
                  <CheckCircle weight="fill" className="text-icon-success" />
                ) : undefined,
            });
          } catch (e) {
            console.warn("JSON parsing failed on join event stream", e);
          }
        },
      });

      return promise;
    },
    onSuccess: async (user) => {
      await queryClient.cancelQueries(userOptions());
      queryClient.setQueryData(userOptions().queryKey, user);
    },
    onSettled: () => {
      queryClient.invalidateQueries(userOptions());
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => fetchGuildLeave({ guildId: guild.data.id }),
    onSuccess: async () => {
      await queryClient.cancelQueries(userOptions());
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

  return isJoined ? (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* TODO: IconButton component */}
        <Button
          className="size-11 rounded-full"
          onClick={() => {
            leaveMutation.mutate();
          }}
          isLoading={leaveMutation.isPending}
          leftIcon={<SignOut weight="bold" />}
        />
      </TooltipTrigger>

      <TooltipContent>
        <p>Leave guild</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <Button
      colorScheme="success"
      className="rounded-2xl"
      onClick={() => {
        joinMutation.mutate();
      }}
      isLoading={joinMutation.isPending}
      loadingText="Joining Guild"
    >
      Join Guild
    </Button>
  );
};
