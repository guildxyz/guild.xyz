"use client";

import { Button } from "@/components/ui/Button";
import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { env } from "@/lib/env";
import { getCookieClientSide } from "@/lib/getCookieClientSide";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventSourcePlus } from "event-source-plus";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { leaveGuild } from "../actions";
import { guildOptions, userOptions } from "../options";

export const JoinButton = () => {
  const { guildUrlName } = useParams<{ guildUrlName: string }>();
  const user = useQuery(userOptions());
  const guild = useQuery(guildOptions({ idLike: guildUrlName }));
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
        keepalive: true,
        maxRetryCount: 1,
        headers: {
          "x-auth-token": token,
          "content-type": "application/json",
        },
      });

      eventSource.listen({
        onMessage: (sseMessage) => {
          try {
            // biome-ignore lint/suspicious/noExplicitAny: TODO: fill missing types
            const { status, message } = JSON.parse(sseMessage.data) as any;
            const toastFunction =
              status === "complete" ? toast.success : toast.info;
            toastFunction(status, {
              description: message,
              richColors: status === "complete",
            });
          } catch (e) {
            console.log("json parsing failed on join event stream", e);
          }
        },
      });
    },
    onSuccess: async () => {
      await queryClient.cancelQueries(userOptions());
      const prev = queryClient.getQueryData(userOptions().queryKey);
      if (prev) {
        queryClient.setQueryData(userOptions().queryKey, {
          ...prev,
          guilds: prev?.guilds?.concat({ guildId: guild.data.id }),
        });
      }
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveGuild({ guildId: guild.data.id }),
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
    <Button
      colorScheme="destructive"
      className="rounded-2xl"
      onClick={() => {
        leaveMutation.mutate();
      }}
      isLoading={leaveMutation.isPending}
      loadingText="Leaving Guild"
    >
      Leave Guild
    </Button>
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
