import { Button, FormControl, FormLabel, HStack, Icon } from "@chakra-ui/react"
import FileInput from "components/common/FileInput"
import FormErrorMessage from "components/common/FormErrorMessage"
import GuildLogo from "components/common/GuildLogo"
import { File } from "phosphor-react"
import { useFormContext, useWatch } from "react-hook-form"

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
          size={48}
          bgColor="gray.100"
        />

        <FileInput
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
            fontSize="sm"
            height={10}
          >
            Choose image
          </Button>
        </FileInput>
      </HStack>
      <FormErrorMessage>{errors?.customImage?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default PhotoUploader
