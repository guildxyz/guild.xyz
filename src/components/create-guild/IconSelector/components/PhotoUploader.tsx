import { FormControl, FormLabel, HStack, Progress } from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import GuildLogo from "components/common/GuildLogo"
import useDropzone from "hooks/useDropzone"
import { Uploader } from "hooks/usePinata/usePinata"
import { File } from "phosphor-react"
import { useState } from "react"
import { FileError } from "react-dropzone"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  uploader: Uploader
  closeModal: () => void
  minW?: number
  minH?: number
}

type FileWithWidthandHeight = File & { width: number; height: number }

const errorMessages = {
  "file-too-large": "This image is too large, maximum allowed file size is 5MB",
}

const getWidthAndHeightFromFile = (
  file: File
): Promise<{ width: number; height: number }> =>
  new Promise((resolve) => {
    const dataURL = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const { width, height } = img
      URL.revokeObjectURL(dataURL)
      resolve({
        width,
        height,
      })
    }
    img.src = dataURL
  })

const imageDimensionsValidator = (
  file: FileWithWidthandHeight,
  minW: number,
  minH: number
): FileError => {
  if (typeof file.width !== "number" && typeof file.height !== "number") return null

  if (file.width < minW || file.height < minH)
    return {
      code: "dimension-too-small",
      message: getDimensionErrorMessage(minW, minH),
    }

  return null
}

const getDimensionErrorMessage = (minW?: number, minH?: number): string => {
  if (minW && minH) return `Image should be at lest ${minW}x${minH}px`
  return `Image ${minW ? "width" : "height"} should be at least ${minW || minH}px`
}

const PhotoUploader = ({
  uploader: { onUpload, isUploading },
  closeModal,
  minW,
  minH,
}: Props): JSX.Element => {
  const { setValue } = useFormContext()
  const imageUrl = useWatch({ name: "imageUrl" })

  const [progress, setProgress] = useState<number>(0)

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    // We need to use any here unfortunately, but this is the correct usage according to the react-dropzone source code
    getFilesFromEvent: async (event: any) => {
      const filesFromEvent = event.dataTransfer
        ? event.dataTransfer.files
        : event.target.files

      if (!minW || !minH) return filesFromEvent

      const filePromises = []

      for (const file of filesFromEvent) {
        filePromises.push(
          new Promise(async (resolve) => {
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
      (minW || minH) &&
      imageDimensionsValidator(
        file as unknown as FileWithWidthandHeight,
        minW,
        minH
      ),
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setValue("imageUrl", URL.createObjectURL(accepted[0]))
        closeModal()
        onUpload({ data: [accepted[0]], onProgress: setProgress })
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

        {isUploading ? (
          <Progress
            mt={3}
            w="full"
            isIndeterminate={progress === 0}
            value={progress * 100}
          />
        ) : (
          <Button
            {...getRootProps()}
            as="label"
            variant="outline"
            leftIcon={<File />}
            fontWeight="medium"
          >
            <input {...getInputProps()} hidden />
            {isDragActive ? "Drop the file here" : "Choose image"}
          </Button>
        )}
      </HStack>
      <FormErrorMessage>
        {errorMessages[fileRejections?.[0]?.errors?.[0]?.code] ??
          fileRejections?.[0]?.errors?.[0]?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default PhotoUploader
