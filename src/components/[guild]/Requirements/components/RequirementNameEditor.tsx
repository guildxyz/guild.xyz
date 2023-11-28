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
  nameEditingEnabled,
  children,
}: PropsWithChildren<{
  baseFieldPath: string
  textRef: MutableRefObject<HTMLParagraphElement>
  nameEditingEnabled: boolean
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
              defaultValue: textRef.current?.textContent,
              keepDirty: true,
            }),
        }),
      }

  return (
    <>
      <Box
        borderWidth={isEditing ? 1 : 0}
        borderRadius="lg"
        display={isEditing ? "flex" : "inline-block"}
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
            <IconButton
              size="xs"
              variant="unstyled"
              display={nameEditingEnabled ? "inline-block" : "none"}
              alignItems="center"
              ml={2}
              {...iconButtonProps}
            />
            <SetVisibility
              ml={2}
              entityType="requirement"
              fieldBase={baseFieldPath}
            />
          </Text>
        )}
        {isEditing && (
          <IconButton
            size="xs"
            variant="unstyled"
            display={"inline-block"}
            alignItems="center"
            ml={2}
            {...iconButtonProps}
          />
        )}
      </Box>
      {isEditing && (
        <SetVisibility ml={2} entityType="requirement" fieldBase={baseFieldPath} />
      )}
    </>
  )
}

const RequirementNameEditorWrapper = ({
  baseFieldPath,
  nameEditingEnabled,
  children,
}: PropsWithChildren<{ baseFieldPath: string; nameEditingEnabled: boolean }>) => {
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
    if (value === originalValue) {
      resetField(`${baseFieldPath}.data.customName`, {
        defaultValue: "",
        keepDirty: true,
      })
    }
  }

  return (
    <Editable
      size="sm"
      bg="transparent"
      {...field}
      onSubmit={conditionallyResetToOriginal}
      onCancel={conditionallyResetToOriginal}
      isDisabled={!nameEditingEnabled}
    >
      <RequirementNameEditor
        baseFieldPath={baseFieldPath}
        textRef={textRef}
        nameEditingEnabled={nameEditingEnabled}
      >
        {children}
      </RequirementNameEditor>
    </Editable>
  )
}

export default RequirementNameEditorWrapper
