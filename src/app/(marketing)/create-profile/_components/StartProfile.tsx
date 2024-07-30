"use client"

import { ConnectFarcasterButton } from "@/components/Account/components/AccountModal/components/FarcasterProfile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
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
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner, UploadSimple, User } from "@phosphor-icons/react"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import useUser from "components/[guild]/hooks/useUser"
import useDropzone from "hooks/useDropzone"
import usePinata from "hooks/usePinata"
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
  const { farcasterProfiles = [], isLoading: isUserLoading } = useUser()
  const farcasterProfile = farcasterProfiles.at(0)
  const [method, setMethod] = useState<CreateMethod>()
  const { toast } = useToast()

  useEffect(() => {
    if (!farcasterProfile || method !== CreateMethod.FillByFarcaster) return
    form.setValue(
      "name",
      farcasterProfile.username ?? form.getValues()?.name ?? "",
      { shouldValidate: true }
    )
    form.setValue("profileImageUrl", farcasterProfile.avatar, {
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
    createProfile.onSubmit(values)
    console.log("onSubmit", values)
  }

  const { isUploading, onUpload } = usePinata({
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

  const [uploadProgress, setUploadProgress] = useState(0)
  const { isDragActive, fileRejections, getRootProps } = useDropzone({
    multiple: false,
    noClick: false,
    maxSizeMb: 4,
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles[0]) return
      onUpload({
        data: [acceptedFiles[0]],
        onProgress: setUploadProgress,
      })
    },
  })

  useEffect(() => {
    for (const { errors, file } of fileRejections) {
      for (const error of errors) {
        toast({
          variant: "error",
          title: `Failed to upload file "${file.name}"`,
          description: error.message,
        })
      }
    }
  }, [fileRejections])

  let avatarFallBackIcon = <User size={32} />
  if (isDragActive) {
    avatarFallBackIcon = <UploadSimple size={32} className="animate-wiggle" />
  } else if (isUploading || (uploadProgress !== 0 && uploadProgress !== 1)) {
    avatarFallBackIcon = <Spinner size={32} className="animate-spin" />
  }

  return (
    <div className="w-[28rem] space-y-3 p-8">
      <h1 className="mb-10 text-pretty text-center font-bold font-display text-2xl leading-none tracking-tight">
        Start your Guild Profile!
      </h1>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="profileImageUrl"
            render={({ field }) => (
              <Button
                variant="unstyled"
                type="button"
                disabled={method === undefined}
                className={cn(
                  "mb-8 size-36 self-center rounded-full border-2 border-dotted",
                  { "border-solid": field.value }
                )}
                {...getRootProps()}
              >
                <Avatar className="size-36 bg-card-secondary">
                  {field.value && (
                    <AvatarImage
                      src={field.value}
                      width={144}
                      height={144}
                      alt="profile avatar"
                    />
                  )}
                  <AvatarFallback className="bg-card-secondary">
                    {avatarFallBackIcon}
                  </AvatarFallback>
                </Avatar>
              </Button>
            )}
          />

          {method === undefined ? (
            <>
              {farcasterProfile ? (
                <Button
                  className="ml-0 w-full gap-2 bg-farcaster hover:bg-farcaster-hover active:bg-farcaster-active"
                  size="md"
                  onClick={() => setMethod(CreateMethod.FillByFarcaster)}
                >
                  <FarcasterImage />
                  Fill using Farcaster
                </Button>
              ) : (
                <ConnectFarcasterButton className="ml-0 w-full gap-2" size="md">
                  <FarcasterImage />
                  Connect farcaster
                </ConnectFarcasterButton>
              )}

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
                isLoading={createProfile.isLoading}
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
