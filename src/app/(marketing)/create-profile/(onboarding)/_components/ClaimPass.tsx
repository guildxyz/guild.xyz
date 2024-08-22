import { Button } from "@/components/ui/Button"
import {
  FormControl,
  FormDescription,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { Schemas, schemas } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import useSWRImmutable from "swr/immutable"
import { z } from "zod"
import { OnboardingChain } from "../types"
import { GuildPassScene } from "./GuildPassScene"

const formSchema = schemas.ProfileCreationSchema.pick({ username: true })

export const ClaimPass: OnboardingChain = ({ dispatchChainAction, chainData }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: chainData.referrerProfile?.username ?? "",
    },
    mode: "onTouched",
  })

  const [username, setUsername] = useState<string>()
  const referrer = useSWRImmutable<Schemas["Profile"]>(
    username ? `/v2/profiles/${username}` : null
  )
  const finalReferrer =
    (!form.getFieldState("username").isDirty && chainData.referrerProfile) ||
    referrer.data

  useEffect(() => {
    if (referrer.error) {
      form.setError("username", { message: referrer.error.error })
      return
    }
  }, [referrer.error, form.setError])

  useEffect(() => {
    if (!referrer.data) return
    form.clearErrors()
  }, [referrer.data, form.clearErrors])

  function onSubmit(_: z.infer<typeof formSchema>) {
    if (!finalReferrer) {
      throw new Error("Failed to resolve referrer profile")
    }
    dispatchChainAction({ action: "next", data: { referrerProfile: finalReferrer } })
  }

  return (
    <div className="max-w-md p-8">
      <div className="mb-12 h-48 w-full">
        <GuildPassScene sceneVariant="Single Pass" />
      </div>
      <h1 className="mb-14 text-pretty text-center font-extrabold text-2xl leading-none tracking-tighter">
        Claim your Guild Pass and begin an epic adventure!
      </h1>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required>Referrer username</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    required
                    {...field}
                    onBlur={() => {
                      setUsername(field.value)
                      field.onBlur()
                    }}
                  />
                </FormControl>
                <FormErrorMessage />
                <FormDescription>
                  To claim your Guild Pass you must provide an existing profile
                  username
                </FormDescription>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            colorScheme="success"
            className="w-full"
            disabled={!form.formState.isValid || !finalReferrer}
            isLoading={referrer.isLoading}
          >
            Continue
            <ArrowRight weight="bold" />
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}
