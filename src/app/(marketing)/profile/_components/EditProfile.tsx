"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
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
import { Separator } from "@/components/ui/Separator"
import { Textarea } from "@/components/ui/Textarea"
import { toast } from "@/components/ui/hooks/useToast"
import { useDisclosure } from "@/hooks/useDisclosure"
import { useUserPublic } from "@/hooks/useUserPublic"
import { cn } from "@/lib/utils"
import { profileSchema } from "@/lib/validations/profileSchema"
import { Schemas } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eyedropper, Image as ImageIcon, Pencil, User } from "@phosphor-icons/react"
import useDropzone from "hooks/useDropzone"
import usePinata from "hooks/usePinata"
import Image from "next/image"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useDeleteProfile } from "../_hooks/useDeleteProfile"
import { EditProfilePayload, useEditProfile } from "../_hooks/useEditProfile"

export const EditProfile = (
  profile: EditProfilePayload & Pick<Schemas["Profile"], "userId">
) => {
  const { id: publicUserId } = useUserPublic()
  const form = useForm<Schemas["ProfileUpdate"]>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...profile,
    },
    mode: "onTouched",
  })

  const disclosure = useDisclosure()
  const editProfile = useEditProfile()
  async function onSubmit(values: Schemas["ProfileUpdate"]) {
    console.log("edit profile submit", values)
    await editProfile.onSubmit({ ...values, id: profile.id })
    if (editProfile.error) return
    disclosure.onClose()
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
  const { isDragActive, getRootProps } = useDropzone({
    multiple: false,
    noClick: false,
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles[0]) return
      onUpload({
        data: [acceptedFiles[0]],
        onProgress: setUploadProgress,
      })
    },
    onError: (error) => {
      toast({
        variant: "error",
        title: `Failed to upload file`,
        description: error.message,
      })
    },
  })

  const deleteProfile = useDeleteProfile()
  const deleteProfileHandler = async () => {
    console.log("deleting profile")
    // values: Pick<Schemas["ProfileCreation"], "username">
    if (profile.username) {
      deleteProfile.onSubmit(profile)
    }
  }

  if (publicUserId !== profile.userId) {
    return
  }

  return (
    <Dialog onOpenChange={disclosure.setValue} open={disclosure.isOpen}>
      <DialogTrigger asChild>
        <Button className="-top-8 absolute right-0" variant="solid">
          <Pencil weight="bold" />
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent size="lg" className="bg-background">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription />
          <DialogCloseButton />
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody>
              <div className="relative mb-20">
                <FormField
                  control={form.control}
                  name="backgroundImageUrl"
                  render={({ field }) => (
                    <FormItem className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl border">
                      <div className="absolute inset-0 size-full">
                        {field.value ? (
                          <Image
                            src={field.value}
                            width={144}
                            height={144}
                            alt="profile background"
                          />
                        ) : (
                          <div className="size-full bg-purple-800" />
                        )}
                      </div>
                      <div className="relative flex items-center gap-3">
                        <Button size="icon" variant="ghost">
                          <ImageIcon weight="bold" size={24} />
                        </Button>
                        <Separator orientation="vertical" className="h-6 w-0.5" />
                        <Button size="icon" variant="ghost">
                          <Eyedropper weight="bold" size={24} />
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profileImageUrl"
                  render={({ field }) => (
                    <Button
                      variant="unstyled"
                      type="button"
                      className={cn(
                        "-bottom-2 absolute left-4 size-28 translate-y-1/2 rounded-full border-2 border-dotted",
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
                          <User size={38} />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="pb-2">
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
                      <Textarea placeholder="" className="max-h-12" {...field} />
                    </FormControl>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
            </DialogBody>
            <DialogFooter>
              <Button
                colorScheme="destructive"
                type="button"
                isLoading={deleteProfile.isLoading}
                onClick={deleteProfileHandler}
              >
                Delete profile
              </Button>
              <Button
                isLoading={editProfile.isLoading}
                colorScheme="success"
                type="submit"
                disabled={!form.formState.isValid}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
