"use client";

import { Button } from "@/components/ui/Button";
import { env } from "@/lib/env";
import { guildOptions, userOptions } from "@/lib/options";
import type { Schemas } from "@guildxyz/types";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventSourcePlus } from "event-source-plus";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const JoinGuild = () => {
  const { guildUrlName } = useParams<{ guildUrlName: string }>();
  const guild = useQuery(guildOptions({ guildIdLike: guildUrlName }));
  const queryClient = useQueryClient();

  if (!guild.data) {
    throw new Error("Failed to fetch guild");
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const url = new URL(
        `api/guild/${guild.data.id}/join`,
        env.NEXT_PUBLIC_API,
      );
      const eventSource = new EventSourcePlus(url.toString(), {
        retryStrategy: "on-error",
        method: "post",
        maxRetryCount: 0,
        headers: {
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
      queryClient.setQueryData(userOptions().queryKey, user);
    },
  });

  return (
    <Button
      colorScheme="success"
      className="rounded-2xl"
      onClick={() => mutate()}
      isLoading={isPending}
      loadingText="Joining Guild"
    >
      Join Guild
    </Button>
  );
};
