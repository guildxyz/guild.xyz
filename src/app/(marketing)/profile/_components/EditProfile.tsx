"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
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
import { Label } from "@/components/ui/Label"
import { toast } from "@/components/ui/hooks/useToast"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { profileSchema } from "@/lib/validations/profileSchema"
import { Schemas } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, User } from "@phosphor-icons/react"
import useDropzone from "hooks/useDropzone"
import usePinata from "hooks/usePinata"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

export const EditProfile = () => {
  const form = useForm<Schemas["ProfileUpdate"]>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      username: "",
    },
    mode: "onTouched",
  })

  // const createProfile = useCreateProfile()
  async function onSubmit(values: Schemas["ProfileUpdate"]) {
    console.log("edit profile submit", values)
    // createProfile.onSubmit(values)
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="-top-8 absolute right-0" variant="solid">
          <Pencil weight="bold" />
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent size="xl" className="bg-background">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody>
              <FormField
                control={form.control}
                name="profileImageUrl"
                render={({ field }) => (
                  <Button
                    variant="unstyled"
                    type="button"
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
                        <User size={38} />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                )}
              />

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
                      <FormLabel aria-required="true">Username</FormLabel>
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
                  disabled={!form.formState.isValid}
                >
                  Start my profile
                </Button>
              </>

              <Label>
                <div>Bio</div>
                <Textarea />
              </Label>
            </DialogBody>
            <DialogFooter>
              <Button colorScheme="success">Save</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
