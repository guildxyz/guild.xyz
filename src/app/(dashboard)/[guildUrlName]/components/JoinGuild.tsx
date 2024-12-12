"use client";

import { SignInButton } from "@/components/SignInButton";
import { Button } from "@/components/ui/Button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/ResponsiveDialog";
import { IDENTITY_STYLES } from "@/config/constants";
import { cn } from "@/lib/cssUtils";
import { env } from "@/lib/env";
import { guildOptions, userOptions } from "@/lib/options";
import { IDENTITY_NAME, type IdentityType } from "@/lib/schemas/identity";
import type { Schemas } from "@guildxyz/types";
import { Check, CheckCircle, XCircle } from "@phosphor-icons/react/dist/ssr";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventSourcePlus } from "event-source-plus";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

const JOIN_MODAL_SEARCH_PARAM = "join";

export const JoinGuild = () => {
  const searchParams = useSearchParams();
  const shouldOpen = searchParams.has(JOIN_MODAL_SEARCH_PARAM);

  const [open, onOpenChange] = useState(false);

  useEffect(() => {
    if (!shouldOpen) return;
    onOpenChange(true);
  }, [shouldOpen]);

  const { data: user } = useQuery(userOptions());

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogTrigger asChild>
        <Button colorScheme="success" className="rounded-2xl">
          Join Guild
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Join guild</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="gap-2">
          <JoinStep
            complete={!!user}
            label="Sign in"
            button={<SignInButton />}
          />
          {/* TODO: add `requiredIdentities` prop to the Guild entity & list only the necessary identity connect buttons here */}
          <ConnectIdentityJoinStep identity="DISCORD" />
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <JoinGuildButton />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

const JoinStep = ({
  complete,
  label,
  button,
}: { complete: boolean; label: string; button: ReactNode }) => (
  <div className="grid grid-cols-[theme(space.5)_1fr] items-center gap-2">
    <div
      className={cn(
        "flex size-5 items-center justify-center rounded-full border bg-blackAlpha text-white dark:bg-blackAlpha-hard",
        {
          "border-0 bg-icon-success dark:bg-icon-success": complete,
        },
      )}
    >
      {complete && <Check weight="bold" className="size-3" />}
    </div>
    <div className="flex items-center justify-between gap-2">
      <span className="line-clamp-1 font-semibold">{label}</span>
      <div className="shrink-0">{button}</div>
    </div>
  </div>
);

const getReturnToURLWithSearchParams = () => {
  if (typeof window === "undefined") return "";

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.searchParams);

  if (searchParams.get(JOIN_MODAL_SEARCH_PARAM)) {
    return url.toString();
  }

  searchParams.set(JOIN_MODAL_SEARCH_PARAM, "true");

  return `${window.location.href.split("?")[0]}?${searchParams.toString()}`;
};

const ConnectIdentityJoinStep = ({ identity }: { identity: IdentityType }) => {
  const router = useRouter();
  const { data: user } = useQuery(userOptions());

  const connected = !!user?.identities?.find((i) => i.platform === identity);

  const Icon = IDENTITY_STYLES[identity].icon;

  return (
    <JoinStep
      complete={connected}
      label={`Connect ${IDENTITY_NAME[identity]}`}
      button={
        <Button
          onClick={() =>
            router.push(
              `${env.NEXT_PUBLIC_API}/connect/${identity}?returnTo=${getReturnToURLWithSearchParams()}`,
            )
          }
          leftIcon={
            connected ? <Check weight="bold" /> : <Icon weight="fill" />
          }
          disabled={!user || connected} // TODO: once we allow users to log in with 3rd party accounts, we can remove the "!user" part of this
          className={IDENTITY_STYLES[identity].buttonColorsClassName}
        >
          Connect
        </Button>
      }
    />
  );
};

const JoinGuildButton = () => {
  const { guildUrlName } = useParams<{ guildUrlName: string }>();
  const guild = useQuery(guildOptions({ guildIdLike: guildUrlName }));

  const { data: user } = useQuery(userOptions());

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
        credentials: "include",
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
        onResponseError: (ctx) => {
          return reject(ctx.error);
        },
      });

      return promise;
    },
    onSuccess: async (user) => {
      queryClient.setQueryData(userOptions().queryKey, user);
    },
    onError: (error: Error) => {
      toast("Join error", {
        description: error.message,
        icon: <XCircle weight="fill" className="text-icon-error" />,
      });
    },
  });

  return (
    <Button
      colorScheme="success"
      className="w-full rounded-2xl"
      onClick={() => mutate()}
      isLoading={isPending}
      disabled={!user}
      loadingText="Joining Guild"
      size="xl"
    >
      {user ? "Join Guild" : "Sign in to join"}
    </Button>
  );
};
