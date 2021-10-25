import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Img,
  InputGroup,
} from "@chakra-ui/react"
import { File } from "phosphor-react"
import { PropsWithChildren, useRef } from "react"
import { useFormContext, UseFormRegisterReturn, useWatch } from "react-hook-form"

type FileUploadProps = {
  register: UseFormRegisterReturn
  accept?: string
  onChange?: (e) => void
}

const FileUpload = ({
  register,
  accept,
  onChange: customOnChange,
  children,
}: PropsWithChildren<FileUploadProps>) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref, onChange, ...rest } = register

  const handleClick = () => inputRef.current?.click()

  return (
    <InputGroup onClick={handleClick} flex="1">
      <input
        type="file"
        hidden
        accept={accept}
        {...rest}
        ref={(e) => {
          ref(e)
          inputRef.current = e
        }}
        onChange={(e) => {
          onChange(e)
          customOnChange(e)
        }}
      />
      {children}
    </InputGroup>
  )
}

const validateFiles = (value: FileList) => {
  if (value.length < 1) return "File is required"
  for (const actFile of Array.from(value)) {
    const fsMb = actFile.size / (1024 * 1024)
    const MAX_FILE_SIZE = 10
    if (fsMb > MAX_FILE_SIZE) {
      return "Max file size 10mb"
    }
  }
  return true
}

type Props = {
  closeModal: () => void
}

const PhotoUploader = ({ closeModal }: Props): JSX.Element => {
  const { setValue, register } = useFormContext()
  const imageUrl = useWatch({ name: "imageUrl" })

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue("imageUrl", URL.createObjectURL(file))
      closeModal()
      return e.target.value
    }
  }

  return (
    <FormControl>
      <FormLabel>Upload custom image</FormLabel>

      <HStack position="relative" spacing={4}>
        <Box
          position="relative"
          boxSize="12"
          borderRadius="full"
          bgColor="gray.100"
          overflow="hidden"
        >
          {!imageUrl?.match("guildLogos") && (
            <Img src={imageUrl} alt="Placeholder" />
          )}
        </Box>

        <FileUpload
          accept={"image/*"}
          register={register("customImage", {
            validate: validateFiles,
          })}
          onChange={handleChange}
        >
          <Button
            leftIcon={<Icon as={File} />}
            variant="outline"
            borderWidth={1}
            rounded="md"
            size="sm"
            px={6}
            height={10}
          >
            Choose image
          </Button>
        </FileUpload>
      </HStack>
    </FormControl>
  )
}

export default PhotoUploader
