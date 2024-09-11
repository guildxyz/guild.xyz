"use client"

import { schemas } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { PropsWithChildren, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"
import { CreateGuildFormType } from "../types"
import { CreateGuildStep, CreateGuildStepProvider } from "./CreateGuildStepContext"

const defaultValues = {
  name: "",
  imageUrl: "",
  contacts: [
    {
      type: "EMAIL",
      contact: "",
    },
  ],
  /**
   * We need to define these values so the Zod resolver won't throw errors, but we'll actually overwrite the urlName with a proper value in the `useCreateGuild` hook
   *
   * Temporarily creating a default Member role, later the users will be able to pick from Guild Templates
   */
  urlName: "",
  roles: [
    {
      name: "Member",
      imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
      requirements: [
        {
          type: "FREE",
        },
      ],
    },
  ],
} satisfies CreateGuildFormType

const CreateGuildProvider = ({ children }: PropsWithChildren) => {
  const methods = useForm<CreateGuildFormType>({
    mode: "all",
    resolver: zodResolver(schemas.GuildCreationPayloadSchema),
    defaultValues,
  })
  const [step, setStep] = useState<CreateGuildStep>("GENERAL_DETAILS")

  return (
    <CreateGuildStepProvider value={{ step, setStep }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateGuildStepProvider>
  )
}

export { CreateGuildProvider }
