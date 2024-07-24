"use client"

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
// import useUser from "components/[guild]/hooks/useUser"
import { FarcasterProfile } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@phosphor-icons/react"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import FarcasterImage from "/src/static/socialIcons/farcaster.svg"
import { useCreateProfile } from "../_hooks/useCreateProfile"
import { profileSchema } from "../schemas"
import { OnboardingChain } from "../types"

enum CreateMethod {
  FillByFarcaster,
  FromBlank,
}

export const StartProfile: OnboardingChain = () => {
  // const farcasterProfiles = useUser().farcasterProfiles || []
  // const farcasterProfile = farcasterProfiles.at(0)
  const [farcasterProfile, setFarcasterProfile] = useState<FarcasterProfile>()
  const [method, setMethod] = useState<CreateMethod>()

  useEffect(() => {
    if (method !== CreateMethod.FillByFarcaster) return

    const mockedFarcasterProfile: FarcasterProfile = {
      username: "mocked farcaster username",
      userId: 3428402797897,
      avatar: "https://picsum.photos/128",
      fid: 98798739222,
      createdAt: new Date("2008"),
    }
    setTimeout(() => {
      setFarcasterProfile(mockedFarcasterProfile)
    }, 1000)
  }, [method])
  useEffect(() => {
    if (!farcasterProfile || method !== CreateMethod.FillByFarcaster) return
    form.setValue("name", farcasterProfile.username ?? "", { shouldValidate: true })
    form.setValue("username", farcasterProfile.userId.toString(), {
      shouldValidate: true,
    })
  }, [farcasterProfile, method])

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      username: "",
    },
    mode: "onTouched",
  })

  const createProfile = useCreateProfile()
  async function onSubmit(values: z.infer<typeof profileSchema>) {
    // createProfile.onSubmit(values)
    console.log("onSubmit", values)
  }

  return (
    <div className="flex w-[28rem] flex-col gap-3 p-8">
      <h1 className="mb-10 text-pretty text-center font-bold font-display text-2xl leading-none tracking-tight">
        Start your Guild Profile!
      </h1>

      <Avatar className="mb-8 size-36 self-center border bg-card-secondary">
        <AvatarImage
          src={farcasterProfile?.avatar}
          width={144}
          height={144}
        ></AvatarImage>
        <AvatarFallback>
          <User size={32} />
        </AvatarFallback>
      </Avatar>

      {method === undefined ? (
        <>
          <ConnectFarcasterButton
            className="ml-0 w-full gap-2"
            size="md"
            onClick={() => setMethod(CreateMethod.FillByFarcaster)}
          >
            <FarcasterImage />
            Connect farcaster
          </ConnectFarcasterButton>

          <Button variant="ghost">
            I don't have a Farcaster profile
            <ArrowRight weight="bold" />
          </Button>
        </>
      ) : (
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
              onClick={() => setMethod(CreateMethod.FromBlank)}
              disabled={!form.formState.isValid}
            >
              Start my profile
            </Button>
          </form>
        </FormProvider>
      )}
    </div>
  )
}
