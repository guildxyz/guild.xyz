import { Button, FormControl, FormLabel, Icon, Wrap } from "@chakra-ui/react"
import FileInput from "components/common/FileInput"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { File } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import RemoveBackgroundImage from "./RemoveBackgroundImage"

const BackgroundImageUploader = (): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const { localBackgroundImage, setLocalBackgroundImage } = useThemeContext()

  const validateFiles = (e) => {
    if (typeof e === "string") return

    const file = e?.[0]
    if (!file) return

    const fsMb = file.size / (1024 * 1024)
    const MAX_FILE_SIZE = 5
    if (fsMb > MAX_FILE_SIZE) return "Max file size is 5mb"

    // act's like onChange if it's valid
    setLocalBackgroundImage(URL.createObjectURL(file))
  }

  return (
    <FormControl isInvalid={errors?.theme?.backgroundImage}>
      <FormLabel>Custom background image</FormLabel>

      <Wrap>
        <FileInput
          accept={"image/*"}
          register={register("theme.backgroundImage", {
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
        {localBackgroundImage && <RemoveBackgroundImage />}
      </Wrap>

      <FormErrorMessage>{errors?.theme?.backgroundImage?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default BackgroundImageUploader
