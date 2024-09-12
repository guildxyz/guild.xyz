"use client"

import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Button } from "@/components/ui/Button"
import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { motion } from "framer-motion"
import { useFormContext, useWatch } from "react-hook-form"
import { CreateGuildFormType } from "../types"
import { CreateGuildImageUploader } from "./CreateGuildImageUploader"
import { useCreateGuildContext } from "./CreateGuildProvider"
import { EmailFormField } from "./EmailFormField"

const CreateGuildCard = () => {
  const { setStep } = useCreateGuildContext()
  const { isWeb3Connected } = useWeb3ConnectionManager()

  const { control } = useFormContext<CreateGuildFormType>()
  const name = useWatch({ control, name: "name" })

  return (
    <motion.div
      className="mx-auto flex max-w-md flex-col px-5 py-6 md:px-6"
      layout="position" // To avoid stretching
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(2px)" }}
      transition={{ duration: 0.1, ease: "easeOut" }}
    >
      <h2 className="mb-7 text-center font-display font-extrabold text-2xl">
        Begin your guild
      </h2>

      <CreateGuildImageUploader />

      <div className="mb-8 flex flex-col gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guild name</FormLabel>
              <FormControl>
                <Input size="lg" {...field} />
              </FormControl>

              <FormErrorMessage />
            </FormItem>
          )}
        />

        <EmailFormField />
      </div>

      <Button
        colorScheme="success"
        size="xl"
        disabled={!name || !isWeb3Connected}
        onClick={() => setStep("CHOOSE_TEMPLATE")}
      >
        Choose Guild template
      </Button>
    </motion.div>
  )
}

export { CreateGuildCard }
