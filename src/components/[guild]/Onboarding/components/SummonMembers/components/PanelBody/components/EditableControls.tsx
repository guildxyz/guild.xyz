import { ChakraProps, IconButton, useEditableControls } from "@chakra-ui/react"
import { Check, PencilSimple } from "phosphor-react"

const commonDefaultProps = {
  size: "xs",
  color: "white",
} as ChakraProps

const EditableControls = (props: ChakraProps) => {
  const { isEditing, getSubmitButtonProps, getEditButtonProps } =
    useEditableControls()

  if (isEditing) {
    return (
      <IconButton
        {...commonDefaultProps}
        aria-label="Save editing"
        icon={<Check />}
        {...getSubmitButtonProps()}
        {...props}
      />
    )
  }

  return (
    <IconButton
      {...commonDefaultProps}
      aria-label="Edit"
      icon={<PencilSimple />}
      {...getEditButtonProps()}
      {...props}
    />
  )
}

export default EditableControls
