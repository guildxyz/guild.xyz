import { ConnectFarcasterButton } from "@/components/Account/components/AccountModal/components/FarcasterProfile"
import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@phosphor-icons/react"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import FarcasterImage from "/src/static/socialIcons/farcaster.svg"
import { OnboardingChain } from "../types"

const formSchema = z.object({
  name: z.string().max(100, { message: "Name cannot exceed 100 characters" }),
  username: z
    .string()
    .min(1, { message: "Handle is required" })
    .max(100, { message: "Handle cannot exceed 100 characters" })
    .superRefine((value, ctx) => {
      const pattern = /^[\w\-.]+$/
      const isValid = pattern.test(value)
      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Handle must only contain either alphanumeric, hyphen, underscore or dot characters",
        })
      }
    }),
})

// TODO: use ConnectFarcasterButton
export const StartProfile: OnboardingChain = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
    },
    mode: "onTouched",
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const [startMethod, setStartMethod] = useState<"farcaster">()
  return (
    <div className="flex w-[28rem] flex-col gap-3 p-8">
      <h1 className="mb-10 text-pretty text-center font-bold font-display text-2xl leading-none tracking-tight">
        Start your Guild Profile!
      </h1>
      <Avatar className="mb-8 size-36 self-center border bg-card-secondary">
        <AvatarFallback>
          <User size={32} />
        </AvatarFallback>
      </Avatar>

      {startMethod ? (
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="pb-2">
                  <FormLabel aria-required="true">Handle</FormLabel>
                  <FormControl>
                    <Input placeholder="" required {...field} />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              colorScheme="success"
              onClick={() => setStartMethod(undefined)}
              disabled={!form.formState.isValid}
            >
              Start my profile
            </Button>
          </form>
        </FormProvider>
      ) : (
        <>
          <ConnectFarcasterButton
            className="ml-0 w-full gap-2"
            size="md"
            onClick={() => setStartMethod("farcaster")}
          >
            <FarcasterImage />
            Connect farcaster
          </ConnectFarcasterButton>

          <Button variant="ghost">
            I don't have a Farcaster profile
            <ArrowRight weight="bold" />
          </Button>
        </>
      )}
    </div>
  )
}