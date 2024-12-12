"use client";

import { associatedGuildsOption } from "@/app/(dashboard)/explorer/options";
import { fetchGuildApi } from "@/lib/fetchGuildApi";
import { userOptions } from "@/lib/options";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/Button";

export const SignOutButton = () => {
  const queryClient = useQueryClient();

  const { mutate: signOut, isPending } = useMutation({
    mutationFn: () =>
      fetchGuildApi("auth/logout", {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: userOptions().queryKey });
      queryClient.resetQueries({
        queryKey: associatedGuildsOption().queryKey,
      });
    },
  });

  return (
    <Button
      variant="ghost"
      leftIcon={<SignOut weight="bold" />}
      onClick={() => signOut()}
      isLoading={isPending}
    >
      Sign out
    </Button>
  );
};
