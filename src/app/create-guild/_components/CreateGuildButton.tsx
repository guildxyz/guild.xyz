"use client"

import { Button } from "@/components/ui/Button"
import { useFormContext, useWatch } from "react-hook-form"
import { useCreateGuild } from "../_hooks/useCreateGuild"
import { CreateGuildFormType } from "../types"

const CreateGuildButton = () => {
  const { control, handleSubmit } = useFormContext<CreateGuildFormType>()
  const { onSubmit, isLoading } = useCreateGuild()

  const templateId = useWatch({ control, name: "templateId" })

  return (
    <Button
      colorScheme="success"
      isLoading={isLoading}
      loadingText="Creating guild"
      onClick={handleSubmit(onSubmit)}
      disabled={!templateId}
    >
      Create guild
    </Button>
  )
}

export { CreateGuildButton }
