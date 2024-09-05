"use client"

import FarcasterImage from "@/../static/socialIcons/farcaster.svg"
import { ConnectFarcasterButton } from "@/components/Account/components/AccountModal/components/FarcasterProfile"
import {} from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/hooks/useToast"
import { EditProfilePicture } from "@app/(marketing)/profile/_components/EditProfile/EditProfilePicture"
import { Schemas, schemas } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import {} from "@phosphor-icons/react"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import useUser from "components/[guild]/hooks/useUser"
import usePinata from "hooks/usePinata"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useCreateProfile } from "../_hooks/useCreateProfile"
import { CreateProfileStep } from "../types"

enum CreateMethod {
  FillByFarcaster,
  FromBlank,
}

export const StartProfile: CreateProfileStep = ({ data: chainData }) => {
  const { farcasterProfiles = [] } = useUser()
  const farcasterProfile = farcasterProfiles.at(0)
  const [method, setMethod] = useState<CreateMethod | undefined>(
    farcasterProfile ? CreateMethod.FillByFarcaster : undefined
  )
  const { toast } = useToast()

  useEffect(() => {
    if (!farcasterProfile) return
    setMethod(CreateMethod.FillByFarcaster)
    form.setValue(
      "name",
      farcasterProfile.username ?? form.getValues()?.name ?? "",
      { shouldValidate: true }
    )
    form.setValue("profileImageUrl", farcasterProfile.avatar, {
      shouldValidate: true,
    })
  }, [farcasterProfile])

  const form = useForm<Schemas["ProfileCreation"]>({
    resolver: zodResolver(
      schemas.ProfileCreationSchema.omit({ referrerUserId: true })
    ),
    defaultValues: {
      name: "",
      username: "",
    },
    mode: "onTouched",
  })

  const createProfile = useCreateProfile()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (createProfile.isLoading) {
      setIsLoading(true)
    } else if (createProfile.error) {
      setIsLoading(false)
    }
  }, [createProfile.isLoading, createProfile.error])
  async function onSubmit(values: Schemas["ProfileCreation"]) {
    if (!chainData.referrerProfile?.userId) {
      throw new Error("Tried to create profile with empty referrer profile")
    }
    createProfile.onSubmit({
      ...values,
      referrerUserId: chainData.referrerProfile.userId,
    })
  }

  const profilePicUploader = usePinata({
    control: form.control,
    fieldToSetOnSuccess: "profileImageUrl",
    onError: (error) => {
      toast({
        variant: "error",
        title: "Failed to upload file",
        description: error,
      })
    },
  })

  return (
    <div className="w-[28rem] space-y-3 p-8">
      <h1 className="mb-10 text-pretty text-center font-bold font-display text-2xl leading-none tracking-tight">
        Start your Guild Profile!
      </h1>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <EditProfilePicture
            uploader={profilePicUploader}
            className="mb-8 size-36 self-center border-2 bg-card-secondary"
          />

          {method === undefined ? (
            <>
              <ConnectFarcasterButton
                className="ml-0 flex w-full items-center gap-2"
                size="md"
                disabled={!!farcasterProfile}
              >
                <div className="size-5">
                  <FarcasterImage />
                </div>
                Connect farcaster
              </ConnectFarcasterButton>
              <Button
                variant="ghost"
                onClick={() => setMethod(CreateMethod.FromBlank)}
              >
                I don't have a Farcaster profile
                <ArrowRight weight="bold" />
              </Button>
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        value={field.value ?? undefined}
                      />
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
                    <FormLabel aria-required="true">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        required
                        {...field}
                        value={field.value ?? undefined}
                      />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full"
                type="submit"
                colorScheme="success"
                isLoading={isLoading}
                disabled={!form.formState.isValid}
              >
                Start my profile
              </Button>
            </>
          )}
        </form>
      </FormProvider>
    </div>
  )
}
