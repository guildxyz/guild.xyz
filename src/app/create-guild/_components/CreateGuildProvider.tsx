"use client"

import { schemas } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  CreatableGuildTemplate,
  CreateGuildFormType,
  CreateGuildStep,
} from "../types"

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
  roles: [],
} satisfies CreateGuildFormType

const CreateGuildContext = createContext<{
  templates: CreatableGuildTemplate[]
  step: CreateGuildStep
  setStep: Dispatch<SetStateAction<CreateGuildStep>>
}>({
  templates: [],
  step: "GENERAL_DETAILS",
  setStep: () => {},
})

const CreateGuildProvider = ({
  templates,
  children,
}: PropsWithChildren<{
  templates: CreatableGuildTemplate[]
}>) => {
  const methods = useForm<CreateGuildFormType>({
    mode: "all",
    resolver: zodResolver(schemas.GuildCreationPayloadSchema),
    defaultValues,
  })
  const [step, setStep] = useState<CreateGuildStep>("GENERAL_DETAILS")

  return (
    <CreateGuildContext.Provider value={{ step, setStep, templates }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateGuildContext.Provider>
  )
}

const useCreateGuildContext = () => useContext(CreateGuildContext)

export { CreateGuildProvider, useCreateGuildContext }
