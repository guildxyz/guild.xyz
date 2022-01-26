import { Button, Icon } from "@chakra-ui/react"
import useEdit from "components/[guild]/hooks/useEdit"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { X } from "phosphor-react"

const RemoveBackgroundImage = () => {
  const { onSubmit, isLoading } = useEdit(() => setLocalBackgroundImage(null))
  const { setLocalBackgroundImage } = useThemeContext()

  const handleRemoveImage = () => onSubmit({ theme: { backgroundImage: "" } })
  return (
    <Button
      leftIcon={<Icon as={X} />}
      colorScheme="red"
      variant="outline"
      borderWidth={1}
      rounded="md"
      fontSize="sm"
      height={10}
      isLoading={isLoading}
      onClick={handleRemoveImage}
    >
      Remove image
    </Button>
  )
}

export default RemoveBackgroundImage
