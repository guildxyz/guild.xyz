import {
  Box,
  Editable,
  EditableInput,
  IconButton,
  Text,
  useEditableControls,
} from "@chakra-ui/react"
import SetVisibility from "components/[guild]/SetVisibility"
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

  if (isEditing)
    return (
      <Box
        borderWidth={1}
        borderRadius="lg"
        display={"flex"}
        pl={2}
        overflow={"hidden"}
      >
        <EditableInput
          _focus={{
            boxShadow: "none",
          }}
          p={0}
          borderRadius={0}
        />
        <IconButton
          size="xs"
          variant="ghost"
          borderRadius={0}
          aria-label="Edit"
          icon={<Check />}
          colorScheme={"green"}
          {...getSubmitButtonProps()}
        />
      </Box>
    )

  return (
    <Text wordBreak="break-word" ref={textRef}>
      {children}
      <IconButton
        size="xs"
        variant="ghost"
        ml={0.5}
        mt={-0.5}
        aria-label="Save"
        icon={<PencilSimple />}
        color="gray"
        {...getEditButtonProps({
          onClick: () =>
            resetField(`${baseFieldPath}.data.customName`, {
              defaultValue: textRef.current?.textContent,
              keepDirty: true,
            }),
        })}
      />
      <SetVisibility entityType="requirement" fieldBase={baseFieldPath} mt={-0.5} />
    </Text>
  )
}

const RequirementNameEditorWrapper = ({
  baseFieldPath,
  children,
}: PropsWithChildren<{ baseFieldPath: string }>) => {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [originalValue, setOriginalValue] = useState("")

  const { field } = useController({
    name: `${baseFieldPath}.data.customName`,
  })

  useEffect(() => {
    if (!textRef.current || !!originalValue || !!field.value) return
    setOriginalValue(textRef.current.textContent)
  }, [textRef.current, originalValue, field.value])

  const { resetField } = useFormContext()

  const conditionallyResetToOriginal = (value) => {
    if (value === originalValue || value.trim() === "") {
      resetField(`${baseFieldPath}.data.customName`, {
        defaultValue: "",
        keepDirty: true,
      })
    }
  }

  return (
    <Editable
      size="sm"
      width="full"
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
