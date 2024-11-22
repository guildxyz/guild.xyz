"use client";

import { type CreateGuildForm, GuildSchema } from "@/lib/schemas/guild";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";

const defaultValues = {
  name: "",
  imageUrl: "",
  urlName: "test",
  contact: "",
} satisfies CreateGuildForm;

const CreateGuildFormProvider = ({ children }: PropsWithChildren) => {
  const methods = useForm<CreateGuildForm>({
    mode: "all",
    resolver: zodResolver(GuildSchema),
    defaultValues,
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export { CreateGuildFormProvider };
