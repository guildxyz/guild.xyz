"use client"

import {} from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
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
import { Separator } from "@/components/ui/Separator"
import { Textarea } from "@/components/ui/Textarea"
import { toast } from "@/components/ui/hooks/useToast"
import { useDisclosure } from "@/hooks/useDisclosure"
import { Schemas, schemas } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import { PropsWithChildren, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useDeleteProfile } from "../../_hooks/useDeleteProfile"
import { useProfile } from "../../_hooks/useProfile"
import { useUpdateProfile } from "../../_hooks/useUpdateProfile"
import { EditProfileBanner } from "./EditProfileBanner"
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
    onError: (error) => {
      toast({
        variant: "error",
        title: "Failed to upload file",
        description: error,
      })
    },
  })

  const backgroundUploader = usePinata({
    control: form.control,
    fieldToSetOnSuccess: "backgroundImageUrl",
    onError: (error) =>
      toast({
        variant: "error",
        title: "Failed to upload file",
        description: error,
      }),
  })

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    form.handleSubmit(onSubmit),
    profilePicUploader.isUploading || backgroundUploader.isUploading
  )

  const deleteProfile = useDeleteProfile()
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  useEffect(() => {
    if (deleteProfile.isLoading) {
      setIsDeleteLoading(true)
    } else if (deleteProfile.error) {
      setIsDeleteLoading(false)
    }
  }, [deleteProfile.isLoading, deleteProfile.error])

  return (
    <Dialog onOpenChange={disclosure.setValue} open={disclosure.isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <FormProvider {...form}>
        <DialogContent size="lg" className="bg-background" scrollBody>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody scroll className="!pb-8">
            <div className="relative mb-20">
              <EditProfileBanner backgroundUploader={backgroundUploader} />
              <EditProfilePicture uploader={profilePicUploader} />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="pb-2">
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
            <Separator className="my-4" />
            <div>
              <p className="mb-2 font-medium">Danger zone</p>
              <Button
                onClick={deleteProfile.onSubmit}
                isLoading={isDeleteLoading}
                variant="subtle"
                type="button"
                colorScheme="destructive"
                size="sm"
              >
                Delete profile
              </Button>
            </div>
          </DialogBody>
          <DialogFooter className="border-border-muted border-t py-4">
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
