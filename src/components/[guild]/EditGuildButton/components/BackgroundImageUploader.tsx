import { FormControl, FormLabel, Progress, Wrap } from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
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
  const { localBackgroundImage, setLocalBackgroundImage } = useThemeContext()
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
          pinataUpload({ data: [accepted[0]], onProgress: setProgress })
            .then(({ IpfsHash }) => {
              setValue(
                "theme.backgroundImage",
                `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`
              )
            })
            .catch((e) => {
              toast({
                status: "error",
                title: "Failed to upload image",
                description: e,
              })
              setLocalBackgroundImage(null)
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
            variant="outline"
            leftIcon={<File />}
            h="10"
          >
            <input {...getInputProps()} hidden />
            {isDragActive ? "Drop the file here" : "Choose image"}
          </Button>
        )}
        {localBackgroundImage && <RemoveBackgroundImage />}
      </Wrap>

      <FormErrorMessage>
        {errorMessages[fileRejections?.[0]?.errors?.[0]?.code] ??
          fileRejections?.[0]?.errors?.[0]?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default BackgroundImageUploader
