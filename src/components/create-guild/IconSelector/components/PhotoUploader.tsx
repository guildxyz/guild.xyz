import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  InputGroup,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
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
          customOnChange?.(e)
        }}
      />
      {children}
    </InputGroup>
  )
}

type Props = {
  closeModal: () => void
}

const PhotoUploader = ({ closeModal }: Props): JSX.Element => {
  const {
    setValue,
    register,
    formState: { errors },
  } = useFormContext()
  const imageUrl = useWatch({ name: "imageUrl" })

  const validateFiles = (e) => {
    const file = e?.[0]
    if (!file) return

    const fsMb = file.size / (1024 * 1024)
    const MAX_FILE_SIZE = 5
    if (fsMb > MAX_FILE_SIZE) return "Max file size is 5mb"

    // act's like onChange if it's valid
    setValue("imageUrl", URL.createObjectURL(file))
    closeModal()
  }

  return (
    <FormControl isInvalid={errors?.customImage}>
      <FormLabel>Upload custom image</FormLabel>

      <HStack position="relative" spacing={4}>
        <GuildLogo
          imageUrl={!imageUrl?.match("guildLogos") ? imageUrl : null}
          size="12"
          bgColor="gray.100"
        />

        <FileUpload
          accept={"image/*"}
          register={register("customImage", {
            validate: validateFiles,
          })}
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
      <FormErrorMessage>{errors?.customImage?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default PhotoUploader
