"use client";

import { useConfetti } from "@/components/ConfettiProvider";
import { Button } from "@/components/ui/Button";
import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { env } from "@/lib/env";
import { fetcher } from "@/lib/fetcher";
import { getCookie } from "@/lib/getCookie";
import type { CreateGuildForm, Guild } from "@/lib/schemas/guild";
import { CheckCircle, XCircle } from "@phosphor-icons/react/dist/ssr";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

const CreateGuildButton = () => {
  const { handleSubmit } = useFormContext<CreateGuildForm>();

  const confetti = useConfetti();

  const router = useRouter();

  const { mutate: onSubmit, isPending } = useMutation({
    mutationFn: async (data: CreateGuildForm) => {
      const token = getCookie(GUILD_AUTH_COOKIE_NAME);

      if (!token) throw new Error("Unauthorized"); // TODO: custom errors?

      const guild = {
        ...data,
        contact: undefined,
        urlName: data.name,
      };

      return fetcher<Guild>(`${env.NEXT_PUBLIC_API}/guild`, {
        method: "POST",
        headers: {
          "X-Auth-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guild),
      });
    },
    onError: (error) => {
      // TODO: parse the error and display it in a user-friendly way
      toast("An error occurred", {
        icon: <XCircle weight="fill" className="text-icon-error" />,
      });
      console.error(error);
    },
    onSuccess: (res) => {
      confetti.current();
      toast("Guild successfully created", {
        description: "You're being redirected to its page",
        icon: <CheckCircle weight="fill" className="text-icon-success" />,
      });
      router.push(`/${res.urlName}`);
    },
  });

  return (
    <Button
      colorScheme="success"
      size="xl"
      isLoading={isPending}
      loadingText="Creating guild"
      onClick={handleSubmit((data) => onSubmit(data))}
    >
      Create guild
    </Button>
  );
};

export { CreateGuildButton };
