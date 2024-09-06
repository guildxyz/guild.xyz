"use client"

import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { FormField } from "@/components/ui/Form"
import { toast } from "@/components/ui/hooks/useToast"
import { cn } from "@/lib/utils"
import { Image, Spinner, UploadSimple, User } from "@phosphor-icons/react"
import { AvatarImage } from "@radix-ui/react-avatar"
import useDropzone from "hooks/useDropzone"
import { Uploader } from "hooks/usePinata/usePinata"
import { useState } from "react"

export const EditProfilePicture = ({
  uploader: { onUpload, isUploading },
  className,
}: { uploader: Uploader; className?: string }) => {
  const [uploadProgress, setUploadProgress] = useState(0)

  const showErrorToast = (description: string) =>
    toast({
      variant: "error",
      title: "Couldn't upload image",
      description,
    })

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    noClick: false,
    onDrop: (acceptedFiles, rejectedFiles) => {
      setUploadProgress(0)
      if (acceptedFiles.length > 0) {
        onUpload({ data: [acceptedFiles[0]], onProgress: setUploadProgress })
      }
      if (rejectedFiles.length > 0)
        showErrorToast(rejectedFiles[0].errors[0].message)
    },
    onError: (err) => {
      showErrorToast(err.message)
    },
  })

  return (
    <FormField
      name="profileImageUrl"
      render={({ field }) => (
        <Button
          variant="unstyled"
          type="button"
          className={cn(
            "relative size-28 overflow-hidden rounded-full border border-dotted p-0",
            { "border-solid": field.value },
            className
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} hidden />
          <Avatar className="size-full bg-transparent">
            {field.value && (
              <AvatarImage
                src={field.value}
                alt="profile avatar"
                className="size-full object-cover"
              />
            )}
            <AvatarFallback className="bg-transparent">
              <User size={38} />
            </AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.50)] text-white opacity-0 transition-opacity hover:opacity-100",
              (isDragActive || isUploading) && "opacity-100"
            )}
          >
            {isUploading ? (
              uploadProgress ? (
                <p>{(uploadProgress * 100).toFixed(0)}%</p>
              ) : (
                <Spinner weight="bold" size={24} className="animate-spin" />
              )
            ) : isDragActive ? (
              <UploadSimple weight="bold" size={24} className="animate-wiggle" />
            ) : (
              <Image weight="bold" size={24} />
            )}
          </div>
        </Button>
      )}
    />
  )
}
