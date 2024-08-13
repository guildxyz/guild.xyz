"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
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
import { useProfile } from "../_hooks/useProfile"
import { useUpdateProfile } from "../_hooks/useUpdateProfile"
import { ProfileColorPicker } from "./ProfileColorPicker"

export const EditProfile = () => {
  const { data: profile } = useProfile()
  const form = useForm<Schemas["ProfileUpdate"]>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...profileSchema.parse(profile),
    },
    mode: "onTouched",
  })
  const disclosure = useDisclosure()
  const editProfile = useUpdateProfile()

  async function onSubmit(values: Schemas["ProfileUpdate"]) {
    await editProfile.onSubmit(profileSchema.parse(values))
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

  return (
    <Dialog onOpenChange={disclosure.setValue} open={disclosure.isOpen}>
      <DialogTrigger asChild>
        <Card className="absolute top-0 right-0 rounded-xl">
          <Button variant="solid">
            <Pencil weight="bold" />
            Edit profile
          </Button>
        </Card>
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
                    <FormItem className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl border border-border-muted">
                      <div className="absolute inset-0 size-full">
                        {field.value?.startsWith("http") ||
                        field.value?.startsWith("/") ? (
                          <Image
                            src={field.value}
                            width={144}
                            height={144}
                            alt="profile background"
                          />
                        ) : (
                          <div
                            className={`size-full`}
                            style={{
                              background: field.value ?? "black",
                              filter: "brightness(70%)",
                            }}
                          />
                        )}
                      </div>
                      <div className="relative flex items-center gap-3">
                        <Button size="icon" variant="ghost" className="text-white">
                          <ImageIcon weight="bold" size={24} />
                        </Button>
                        <Separator
                          orientation="vertical"
                          className="h-6 w-0.5 bg-white/50"
                        />
                        <ProfileColorPicker>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="text-white"
                          >
                            <Eyedropper weight="bold" size={24} />
                          </Button>
                        </ProfileColorPicker>
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
                        "-bottom-2 absolute left-4 size-28 translate-y-1/2 rounded-full border border-dotted",
                        { "border-solid": field.value }
                      )}
                      {...getRootProps()}
                    >
                      <Avatar className="size-36 bg-muted">
                        {field.value && (
                          <AvatarImage
                            src={field.value}
                            width={144}
                            height={144}
                            alt="profile avatar"
                          />
                        )}
                        <AvatarFallback className="bg-muted">
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
                      <Input
                        placeholder=""
                        variant="muted"
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
                      <Input placeholder="" variant="muted" required {...field} />
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
                  variant="subtle"
                  type="button"
                  colorScheme="destructive"
                  size="sm"
                >
                  Delete profile
                </Button>
              </div>
            </DialogBody>
            <DialogFooter>
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
