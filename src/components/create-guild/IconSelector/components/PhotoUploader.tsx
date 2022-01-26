import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Progress,
  Text,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import GuildLogo from "components/common/GuildLogo"
import useDropzone from "hooks/useDropzone"
import { UseUploadImageData } from "hooks/useUploadImage"
import { File } from "phosphor-react"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  useUploadImageData: UseUploadImageData
}

const errorMessages = {
  "file-too-large": "This image is too large, maximum allowed file size is 5MB",
}

const PhotoUploader = ({ useUploadImageData }: Props): JSX.Element => {
  const { setValue } = useFormContext()
  const imagePreview = useWatch({ name: "imagePreview" })

  const [progress, setPropgress] = useState<number>(0)

  const { onSubmit: onSubmitImage, isLoading: isImageLoading } = useUploadImageData

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setValue("imagePreview", URL.createObjectURL(accepted[0]))
        onSubmitImage({ file: accepted[0], onProgress: setPropgress })
      }
    },
  })

  return (
    <FormControl isInvalid={!!fileRejections?.[0]}>
      <FormLabel>Upload custom image</FormLabel>

      <HStack>
        {imagePreview?.length > 0 && !imagePreview?.match("guildLogos") && (
          <GuildLogo
            imageUrl={!imagePreview?.match("guildLogos") ? imagePreview : null}
            size={48}
            bgColor="gray.100"
          />
        )}

        {isImageLoading ? (
          <Progress
            mt={3}
            w="full"
            colorScheme="gray"
            isIndeterminate={progress === 0}
            value={progress * 100}
            borderRadius="full"
          />
        ) : (
          <Button
            {...getRootProps()}
            as="label"
            cursor="pointer"
            width="full"
            p={2}
            variant="outline"
            leftIcon={<File size={25} weight="light" />}
            aria-label="Upload logo of guild"
            isDisabled={isImageLoading}
          >
            <input {...getInputProps()} hidden />
            {isDragActive ? (
              <Text fontWeight="thin">Drop the file here</Text>
            ) : (
              <Text fontWeight="normal">Upload image</Text>
            )}
          </Button>
        )}
      </HStack>

      <FormErrorMessage>
        {errorMessages[fileRejections?.[0]?.errors?.[0]?.code]}
      </FormErrorMessage>
    </FormControl>
  )
}

export default PhotoUploader
