"use client"

import FarcasterImage from "@/../static/socialIcons/farcaster.svg"
import { ConnectFarcasterButton } from "@/components/Account/components/AccountModal/components/FarcasterProfile"
import { Button } from "@/components/ui/Button"
import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { uploadImageUrlToPinata } from "@/lib/uploadImageUrlToPinata"
import { EditProfilePicture } from "@app/(marketing)/profile/_components/EditProfile/EditProfilePicture"
import { Schemas, schemas } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import useUser from "components/[guild]/hooks/useUser"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import { useEffect, useRef, useState } from "react"
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
  })
  const isFarcasterAvatarUploaded = useRef(false)

  useEffect(() => {
    if (!farcasterProfile) return
    setMethod(CreateMethod.FillByFarcaster)
    form.setValue(
      "name",
      farcasterProfile.username ?? form.getValues()?.name ?? "",
      { shouldValidate: true }
    )
    if (!farcasterProfile.avatar || isFarcasterAvatarUploaded.current) return
    uploadImageUrlToPinata({
      onUpload: profilePicUploader.onUpload,
      image: new URL(farcasterProfile.avatar),
    })
    isFarcasterAvatarUploaded.current = true
  }, [farcasterProfile, profilePicUploader.onUpload, form.setValue, form.getValues])

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    form.handleSubmit(onSubmit),
    profilePicUploader.isUploading
  )

  return (
    <div className="w-screen max-w-md space-y-3 p-8">
      <h1 className="mb-10 text-pretty text-center font-bold font-display text-2xl leading-none tracking-tight">
        Start your Guild Profile!
      </h1>

      <FormProvider {...form}>
        <div className="flex flex-col gap-3">
          <EditProfilePicture
            uploader={profilePicUploader}
            className="mb-8 size-36 self-center border-2 bg-card-secondary"
          />

          {method === undefined ? (
            <>
              <ConnectFarcasterButton
                className="ml-0 flex w-full items-center gap-2"
                size="lg"
                disabled={!!farcasterProfile}
              >
                <div className="size-5">
                  <FarcasterImage />
                </div>
                Connect farcaster
              </ConnectFarcasterButton>
              <Button
                variant="ghost"
                size="lg"
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
                      <Input size="lg" {...field} value={field.value ?? undefined} />
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
                        size="lg"
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
                size="lg"
                className="w-full"
                colorScheme="success"
                onClick={handleSubmit}
                isLoading={isLoading || isUploadingShown}
                loadingText={uploadLoadingText}
                disabled={!form.formState.isValid}
              >
                Start my profile
              </Button>
            </>
          )}
        </div>
      </FormProvider>
    </div>
  )
}
