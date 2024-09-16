"use client"

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { useDisclosure } from "@/hooks/useDisclosure"
import { filterOnDirtyFormFields } from "@/lib/filterOnDirtyFormFields"
import { Schemas, schemas } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import { PropsWithChildren } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useProfile } from "../../_hooks/useProfile"
import { useUpdateProfile } from "../../_hooks/useUpdateProfile"
import { EditProfileBanner } from "./EditProfileBanner"
import { EditProfileDropdown } from "./EditProfileDropdown"
import { EditProfilePicture } from "./EditProfilePicture"

export const EditProfile = ({ children }: PropsWithChildren<any>) => {
  const { data: profile } = useProfile()
  const form = useForm<Schemas["Profile"]>({
    resolver: zodResolver(schemas.ProfileUpdateSchema),
    defaultValues: {
      ...schemas.ProfileUpdateSchema.parse(profile),
    },
    mode: "onTouched",
  })
  const disclosure = useDisclosure()
  const { onSubmit, isLoading } = useUpdateProfile({ onSuccess: disclosure.onClose })

  const profilePicUploader = usePinata({
    control: form.control,
    fieldToSetOnSuccess: "profileImageUrl",
  })

  const backgroundUploader = usePinata({
    control: form.control,
    fieldToSetOnSuccess: "backgroundImageUrl",
  })

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    form.handleSubmit((params) => {
      onSubmit(filterOnDirtyFormFields(params, form.formState.dirtyFields))
    }),
    profilePicUploader.isUploading || backgroundUploader.isUploading
  )

  return (
    <Dialog onOpenChange={disclosure.setValue} open={disclosure.isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <FormProvider {...form}>
        <DialogContent size="lg" className="bg-background">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription className="sr-only" />
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <div className="relative mb-20">
              <EditProfileBanner backgroundUploader={backgroundUploader} />
              <EditProfilePicture
                uploader={profilePicUploader}
                className="-bottom-2 absolute left-4 translate-y-1/2 bg-muted"
              />
              <EditProfileDropdown uploader={profilePicUploader} />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="pb-3">
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
                <FormItem className="pb-3">
                  <FormLabel aria-required="true">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="" required {...field} />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      className="max-h-12 bg-muted"
                      {...field}
                      value={field.value ?? undefined}
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
          </DialogBody>
          <DialogFooter className="py-8">
            <Button
              isLoading={isLoading || isUploadingShown}
              loadingText={uploadLoadingText ?? "Saving"}
              colorScheme="success"
              onClick={handleSubmit}
              disabled={!form.formState.isValid}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}
