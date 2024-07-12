import {
  IconButton,
  IconButtonProps,
  useColorModeValue,
  useEditableControls,
} from "@chakra-ui/react"
import { Check, PencilSimple } from "phosphor-react"

const EditableControls = (props: Omit<IconButtonProps, "aria-label">) => {
  const { isEditing, getSubmitButtonProps, getEditButtonProps } =
    useEditableControls()

  const conditionalProps = isEditing
    ? { "aria-label": "Edit", icon: <Check />, ...getSubmitButtonProps() }
    : { "aria-label": "Save", icon: <PencilSimple />, ...getEditButtonProps() }

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
