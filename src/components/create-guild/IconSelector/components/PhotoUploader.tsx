import { FormControl, FormLabel, HStack, Progress } from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import GuildLogo from "components/common/GuildLogo"
import useDropzone from "hooks/useDropzone"
import useToast from "hooks/useToast"
import { File } from "phosphor-react"
import { Dispatch, SetStateAction, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"
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
  const imageUrl = useWatch({ name: "imageUrl" })
  const toast = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [progress, setProgress] = useState<number>(0)

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setValue("imageUrl", URL.createObjectURL(accepted[0]))
        closeModal()
        setIsLoading(true)
        setUploadPromise(
          pinataUpload({ data: [accepted[0]], onProgress: setProgress })
            .then(({ IpfsHash }) => {
              setValue(
                "imageUrl",
                `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`,
                { shouldTouch: true }
              )
            })
            .catch((e) => {
              toast({
                status: "error",
                title: "Failed to upload image",
                description: e,
              })
              setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`, {
                shouldTouch: true,
              })
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
        <GuildLogo
          imageUrl={!imageUrl?.match("guildLogos") ? imageUrl : null}
          size={48}
          bgColor="gray.100"
        />

        {isLoading ? (
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
