"use client"

import { Button } from "@/components/ui/Button"
import { useFormContext, useWatch } from "react-hook-form"
import { useCreateGuild } from "../_hooks/useCreateGuild"
import { CreateGuildFormType } from "../types"

const CreateGuildButton = () => {
  const { control, handleSubmit } = useFormContext<CreateGuildFormType>()
  const { onSubmit, isLoading } = useCreateGuild()

  const roles = useWatch({ control, name: "roles" })

  return (
    <Button
      colorScheme="success"
      isLoading={isLoading}
      loadingText="Creating guild"
      onClick={handleSubmit(onSubmit)}
      disabled={!roles?.length}
    >
      Create guild
    </Button>
  )
}

export { CreateGuildButton }
