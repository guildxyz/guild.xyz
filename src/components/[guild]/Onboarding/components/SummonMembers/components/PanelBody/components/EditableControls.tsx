import {
  IconButton,
  IconButtonProps,
  useColorModeValue,
  useEditableControls,
} from "@chakra-ui/react"
import { PiCheck } from "react-icons/pi"
import { PiPencilSimple } from "react-icons/pi"

const EditableControls = (props: Omit<IconButtonProps, "aria-label">) => {
  const { isEditing, getSubmitButtonProps, getEditButtonProps } =
    useEditableControls()

  const conditionalProps = isEditing
    ? { "aria-label": "Edit", icon: <PiCheck />, ...getSubmitButtonProps() }
    : { "aria-label": "Save", icon: <PiPencilSimple />, ...getEditButtonProps() }

  const color = useColorModeValue("gray.600", "white")
  const colorScheme = useColorModeValue("whiteAlpha", undefined)

  return (
    <IconButton
      size="xs"
      colorScheme={colorScheme}
      color={color}
      {...conditionalProps}
      {...props}
    />
  )
}

export default EditableControls
