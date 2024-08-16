import { Button } from "@/components/ui/Button"
import { FormControl, FormErrorMessage, FormItem } from "@/components/ui/Form"
import { Image, Spinner, UploadSimple } from "@phosphor-icons/react/dist/ssr"
import {
  convertFilesFromEvent,
  getWidthAndHeightFromFile,
  imageDimensionsValidator,
} from "components/create-guild/IconSelector/utils"
import useDropzone, { ERROR_MESSAGES } from "hooks/useDropzone"
import usePinata from "hooks/usePinata"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { CreateGuildFormType } from "../types"

const MIN_WIDTH = 512
const MIN_HEIGHT = 512

/**
 * This is a pretty specific component right now, but we should generalise it once we start using it in other places too (e.g. on the create profile page)
 */
const CreateGuildImageUploader = () => {
  const { control } = useFormContext<CreateGuildFormType>()
  const imageUrl = useWatch({ control, name: "imageUrl" })

  const [placeholder, setPlaceholder] = useState<string | null>(null)
  const { fileRejections, getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: false,
    // We need to use any here unfortunately, but this is the correct usage according to the react-dropzone source code
    getFilesFromEvent: async (event: any) => {
      const filesFromEvent = await convertFilesFromEvent(event)

      const filePromises = []

      for (const file of filesFromEvent) {
        filePromises.push(
          new Promise<File>(async (resolve) => {
            if (file.type.includes("svg")) {
              resolve(file)
            } else {
              const { width, height } = await getWidthAndHeightFromFile(file)
              Object.defineProperty(file, "width", { value: width })
              Object.defineProperty(file, "height", { value: height })
              resolve(file)
            }
          })
        )
      }

      const files = await Promise.all(filePromises)
      return files
    },
    validator: (file) =>
      MIN_WIDTH || MIN_HEIGHT
        ? imageDimensionsValidator(file, MIN_WIDTH ?? 0, MIN_HEIGHT ?? 0)
        : null,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        const generatedBlob = URL.createObjectURL(accepted[0])
        setPlaceholder(generatedBlob)
        onUpload({ data: [accepted[0]] })
      }
    },
  })

  const fileRejectionError = fileRejections?.[0]?.errors?.[0]

  const { onUpload, isUploading } = usePinata({
    control,
    fieldToSetOnError: "imageUrl",
    fieldToSetOnSuccess: "imageUrl",
  })

  return (
    <FormItem className="mb-6 flex flex-col items-center justify-center">
      <FormControl className="size-28 rounded-full bg-input-background">
        <Button
          variant="ghost"
          className="relative size-28 rounded-full border border-input-border p-0 disabled:opacity-100"
          disabled={isUploading}
          {...getRootProps()}
        >
          <input {...getInputProps()} hidden />
          {isUploading ? (
            <>
              {placeholder && (
                <div className="absolute inset-0">
                  <img
                    src={placeholder}
                    alt="Uploading image..."
                    className="size-full object-cover opacity-50"
                  />
                </div>
              )}
              <Spinner weight="bold" className="size-1/3 animate-spin" />
            </>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Guild image"
              className="size-full object-cover"
            />
          ) : isDragActive ? (
            <UploadSimple className="h-auto w-1/3" weight="bold" />
          ) : (
            <Image className="h-auto w-1/3" weight="bold" />
          )}
        </Button>
      </FormControl>

      <FormErrorMessage>
        {fileRejectionError?.code in ERROR_MESSAGES
          ? ERROR_MESSAGES[fileRejectionError.code as keyof typeof ERROR_MESSAGES]
          : fileRejectionError?.message}
      </FormErrorMessage>
    </FormItem>
  )
}

export { CreateGuildImageUploader }
