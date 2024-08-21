import { FormControl, FormLabel, HStack } from "@chakra-ui/react"
import { File } from "@phosphor-icons/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import GuildLogo from "components/common/GuildLogo"
import useDropzone, { ERROR_MESSAGES } from "hooks/useDropzone"
import { Uploader } from "hooks/usePinata/usePinata"
import { useFormContext, useWatch } from "react-hook-form"
import { getWidthAndHeightFromFile, imageDimensionsValidator } from "../utils"

type Props = {
  uploader: Uploader
  closeModal?: () => void
  minW?: number
  minH?: number
  onGeneratedBlobChange?: (objectURL: string) => void
}

const PhotoUploader = ({
  uploader: { onUpload, isUploading },
  closeModal,
  minW,
  minH,
  onGeneratedBlobChange,
}: Props): JSX.Element => {
  const { setValue } = useFormContext()
  const imageUrl = useWatch({ name: "imageUrl" })

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    // We need to use any here unfortunately, but this is the correct usage according to the react-dropzone source code
    getFilesFromEvent: async (event: any) => {
      const filesFromEvent = event.dataTransfer
        ? event.dataTransfer.files
        : event.target.files

      if (!minW || !minH) return Array.from(filesFromEvent)

      const filePromises = []

      for (const file of filesFromEvent) {
        filePromises.push(
          new Promise<File>(async (resolve) => {
            if (file.type.includes("svg")) {
              resolve(file)
            } else {
              const { width, height } = await getWidthAndHeightFromFile(file)
              file.width = width
              file.height = height
              resolve(file)
            }
          })
        )
      }

      const files = await Promise.all(filePromises)
      return files
    },
    validator: (file) =>
      minW || minH ? imageDimensionsValidator(file, minW ?? 0, minH ?? 0) : null,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        const generatedBlob = URL.createObjectURL(accepted[0])
        onGeneratedBlobChange?.(generatedBlob)
        setValue("imageUrl", generatedBlob)
        closeModal?.()
        onUpload({ data: [accepted[0]] })
      }
    },
  })

  return (
    <FormControl isInvalid={!!fileRejections?.[0]}>
      <FormLabel>Upload custom image</FormLabel>

      <HStack>
        <GuildLogo
          imageUrl={!imageUrl?.match("guildLogos") ? imageUrl : null}
          size={"48px"}
          bgColor="gray.100"
        />
        <Button
          {...getRootProps()}
          as="label"
          variant="outline"
          leftIcon={<File />}
          fontWeight="medium"
          isLoading={isUploading}
          cursor="pointer"
        >
          <input {...getInputProps()} hidden />
          {isDragActive ? "Drop the file here" : "Choose image"}
        </Button>
      </HStack>
      <FormErrorMessage>
        {ERROR_MESSAGES[fileRejections?.[0]?.errors?.[0]?.code] ??
          fileRejections?.[0]?.errors?.[0]?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default PhotoUploader
