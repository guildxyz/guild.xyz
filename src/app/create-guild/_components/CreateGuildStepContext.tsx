"use client"

import { Dispatch, SetStateAction, createContext, useContext } from "react"

export type CreateGuildStep = "GENERAL_DETAILS" | "CHOOSE_TEMPLATE"

const CreateGuildStepContext = createContext<{
  step: CreateGuildStep
  setStep: Dispatch<SetStateAction<CreateGuildStep>>
}>({
  step: "GENERAL_DETAILS",
  setStep: () => {
    /* Empty */
  },
})

const CreateGuildStepProvider = CreateGuildStepContext.Provider

const useCreateGuildStep = () => useContext(CreateGuildStepContext)

export { CreateGuildStepProvider, useCreateGuildStep }
