import { FormControl, FormLabel, Progress, Wrap } from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useDropzone from "hooks/useDropzone"
import { Uploader } from "hooks/usePinata/usePinata"
import { File } from "phosphor-react"
import { useState } from "react"
import RemoveBackgroundImage from "./RemoveBackgroundImage"

type Props = {
  uploader: Uploader
}

const errorMessages = {
  "file-too-large": "This image is too large, maximum allowed file size is 5MB",
}

const BackgroundImageUploader = ({
  uploader: { isUploading, onUpload },
}: Props): JSX.Element => {
  const { localBackgroundImage, setLocalBackgroundImage } = useThemeContext()
  const [progress, setProgress] = useState<number>(0)

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setLocalBackgroundImage(URL.createObjectURL(accepted[0]))
        onUpload({ data: [accepted[0]], onProgress: setProgress })
      }
    },
  })

  return (
    <FormControl isInvalid={!!fileRejections?.[0]}>
      <FormLabel>Custom background image</FormLabel>

      <Wrap>
        {isUploading ? (
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
