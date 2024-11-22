"use client";

import { useConfetti } from "@/components/ConfettiProvider";
import { Button } from "@/components/ui/Button";
import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { env } from "@/lib/env";
import { fetcher } from "@/lib/fetcher";
import { getCookie } from "@/lib/getCookie";
import type { CreateGuildForm, Guild } from "@/lib/schemas/guild";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import slugify from "slugify";

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
        // TODO: I think we should do it on the backend
        urlName: slugify(data.name, {
          replacement: "-",
          lower: true,
          strict: true,
        }),
      };

      return fetcher<Guild>(`${env.NEXT_PUBLIC_API}/guild`, {
        method: "POST",
        headers: {
          "X-Auth-Token": token,
        },
        body: guild,
      });
    },
    onError: (error) => console.error(error),
    onSuccess: (res) => {
      confetti.current();
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
