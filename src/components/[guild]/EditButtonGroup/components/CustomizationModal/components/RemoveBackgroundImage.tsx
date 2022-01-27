import { Button, Icon } from "@chakra-ui/react"
import useEdit from "components/[guild]/hooks/useEdit"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { X } from "phosphor-react"
import { useEffect } from "react"

const RemoveBackgroundImage = () => {
  const { setLocalBackgroundImage } = useThemeContext()
  const { onSubmit, isLoading, response } = useEdit(() =>
    setLocalBackgroundImage(null)
  )

  const handleRemoveImage = () => onSubmit({ theme: { backgroundImage: "" } } as any)

  useEffect(() => {
    if (!!response) {
      setLocalBackgroundImage("")
    }
  }, [response])

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
