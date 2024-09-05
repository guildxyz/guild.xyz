"use client"

import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { FormField } from "@/components/ui/Form"
import { toast } from "@/components/ui/hooks/useToast"
import { cn } from "@/lib/utils"
import { User } from "@phosphor-icons/react"
import { AvatarImage } from "@radix-ui/react-avatar"
import useDropzone from "hooks/useDropzone"
import { Uploader } from "hooks/usePinata/usePinata"
import { useState } from "react"

export const EditProfilePicture = ({
  onUpload,
}: { onUpload: Uploader["onUpload"] }) => {
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
    <FormField
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
                className="size-full object-cover"
              />
            )}
            <AvatarFallback className="bg-muted">
              <User size={38} />
            </AvatarFallback>
          </Avatar>
        </Button>
      )}
    />
  )
}
