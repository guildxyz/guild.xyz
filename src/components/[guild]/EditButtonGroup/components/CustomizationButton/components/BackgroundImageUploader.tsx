import {
  Button,
  FormControl,
  FormLabel,
  Progress,
  Text,
  Wrap,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import useGuild from "components/[guild]/hooks/useGuild"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useDropzone from "hooks/useDropzone"
import useToast from "hooks/useToast"
import { File } from "phosphor-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import pinataUpload from "utils/pinataUpload"
import RemoveBackgroundImage from "./RemoveBackgroundImage"

const errorMessages = {
  "file-too-large": "This image is too large, maximum allowed file size is 5MB",
}

const BackgroundImageUploader = ({ setUploadPromise }): JSX.Element => {
  const { setValue } = useFormContext()
  const { setLocalBackgroundImage } = useThemeContext()
  const { theme } = useGuild()
  const toast = useToast()
  const [progress, setProgress] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setLocalBackgroundImage(URL.createObjectURL(accepted[0]))
        setIsLoading(true)
        setUploadPromise(
          pinataUpload(accepted[0], setProgress)
            .then(({ IpfsHash }) => {
              setValue(
                "backgroundImage",
                `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`
              )
              toast({
                status: "success",
                title: "Icon uploaded",
                description: "Custom Guild icon uploaded to IPFS",
              })
            })
            .finally(() => setIsLoading(false))
        )
      }
    },
  })

  return (
    <FormControl isInvalid={!!fileRejections?.[0]}>
      <FormLabel>Custom background image</FormLabel>

      <Wrap>
        {isLoading ? (
          <Progress
            borderRadius="full"
            w="full"
            isIndeterminate={progress === 0}
            value={progress * 100}
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
        {theme?.[0]?.backgroundImage && <RemoveBackgroundImage />}
      </Wrap>

      <FormErrorMessage>
        {errorMessages[fileRejections?.[0]?.errors?.[0]?.code]}
      </FormErrorMessage>
    </FormControl>
  )
}

export default BackgroundImageUploader
