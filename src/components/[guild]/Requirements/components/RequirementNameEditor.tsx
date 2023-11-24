import {
  Box,
  Editable,
  EditableInput,
  IconButton,
  Text,
  useEditableControls,
} from "@chakra-ui/react"
import { Check, PencilSimple } from "phosphor-react"
import {
  MutableRefObject,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react"
import { useController, useFormContext } from "react-hook-form"

const RequirementNameEditor = ({
  baseFieldPath,
  textRef,
  children,
}: PropsWithChildren<{
  baseFieldPath: string
  textRef: MutableRefObject<HTMLParagraphElement>
}>) => {
  const { isEditing, getSubmitButtonProps, getEditButtonProps } =
    useEditableControls()
  const { resetField } = useFormContext()

  const iconButtonProps = isEditing
    ? {
        "aria-label": "Edit",
        icon: <Check />,
        color: "green.500",
        ...getSubmitButtonProps(),
      }
    : {
        "aria-label": "Save",
        icon: <PencilSimple />,
        color: "gray",
        ...getEditButtonProps({
          onClick: () =>
            resetField(`${baseFieldPath}.data.customName`, {
              defaultValue: textRef.current?.innerText,
            }),
        }),
      }

  return (
    <Box
      borderWidth={isEditing ? 1 : 0}
      borderRadius="lg"
      display="flex"
      pl={isEditing ? 2 : 0}
    >
      {isEditing ? (
        <EditableInput
          _focus={{
            boxShadow: "none",
          }}
          p={0}
        />
      ) : (
        <Text wordBreak="break-word" ref={textRef}>
          {children}
        </Text>
      )}

      <IconButton
        size="xs"
        variant="unstyled"
        display="flex"
        alignItems="center"
        {...iconButtonProps}
      />
    </Box>
  )
}

const RequirementNameEditorWrapper = ({
  baseFieldPath,
  children,
}: PropsWithChildren<{ baseFieldPath: string }>) => {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [originalValue, setOriginalValue] = useState("")

  useEffect(() => {
    if (!textRef.current || !!originalValue) return
    setOriginalValue(textRef.current.innerText)
  }, [textRef.current, originalValue])

  const { resetField } = useFormContext()
  const { field } = useController({
    name: `${baseFieldPath}.data.customName`,
  })

  const conditionallyResetToOriginal = (value) => {
    if (value === originalValue) {
      resetField(`${baseFieldPath}.data.customName`, { defaultValue: "" })
    }
  }

  return (
    <Editable
      size="sm"
      bg="transparent"
      {...field}
      onSubmit={conditionallyResetToOriginal}
      onCancel={conditionallyResetToOriginal}
    >
      <RequirementNameEditor baseFieldPath={baseFieldPath} textRef={textRef}>
        {children}
      </RequirementNameEditor>
    </Editable>
  )
}

export default RequirementNameEditorWrapper
