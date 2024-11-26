"use client";

import { type CreateGuildForm, CreateGuildSchema } from "@/lib/schemas/guild";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";

const defaultValues = {
  name: "",
  imageUrl: "",
  urlName: "test",
  contact: "",
  description: "",
} satisfies CreateGuildForm;

const CreateGuildFormProvider = ({ children }: PropsWithChildren) => {
  const methods = useForm<CreateGuildForm>({
    mode: "onTouched",
    resolver: zodResolver(CreateGuildSchema),
    defaultValues,
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export { CreateGuildFormProvider };
