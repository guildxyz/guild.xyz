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
import useToast from "hooks/useToast"
import { File } from "phosphor-react"
import { Dispatch, SetStateAction, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import pinataUpload from "utils/pinataUpload"

type Props = {
  setUploadPromise: Dispatch<SetStateAction<Promise<void>>>
  closeModal: () => void
}

const errorMessages = {
  "file-too-large": "This image is too large, maximum allowed file size is 5MB",
}

const PhotoUploader = ({ setUploadPromise, closeModal }: Props): JSX.Element => {
  const { setValue } = useFormContext()
  const imagePreview = useWatch({ name: "imagePreview" })
  const toast = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [progress, setProgress] = useState<number>(0)

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setValue("imagePreview", URL.createObjectURL(accepted[0]))
        setIsLoading(true)
        setUploadPromise(
          pinataUpload(accepted[0], setProgress)
            .then(({ IpfsHash }) => {
              setValue(
                "imageUrl",
                `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`
              )
              toast({
                status: "success",
                title: "Icon uploaded",
                description: "Custom Guild icon uploaded to IPFS",
              })
              closeModal()
            })
            .finally(() => setIsLoading(false))
        )
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

        {isLoading ? (
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
            isDisabled={isLoading}
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
