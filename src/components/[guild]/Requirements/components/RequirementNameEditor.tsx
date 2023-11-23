import {
  Box,
  Editable,
  EditableInput,
  Text,
  useEditableControls,
} from "@chakra-ui/react"
import EditableControls from "components/[guild]/Onboarding/components/SummonMembers/components/PanelBody/components/EditableControls"
import { PropsWithChildren, Ref, useEffect, useRef } from "react"
import { useController, useFormContext } from "react-hook-form"

const RequirementNameEditor = ({
  textRef,
  children,
}: PropsWithChildren<{
  textRef: Ref<HTMLParagraphElement>
}>) => {
  const { isEditing } = useEditableControls()

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
      <EditableControls variant="unstyled" display="flex" alignItems="center" />
    </Box>
  )
}

const RequirementNameEditorWrapper = ({
  baseFieldPath,
  children,
}: PropsWithChildren<{ baseFieldPath: string }>) => {
  const textRef = useRef(null)

  const { resetField } = useFormContext()
  const { field } = useController({
    name: `${baseFieldPath}.data.customName`,
  })

  useEffect(() => {
    if (!textRef.current || !!field.value) return
    resetField(`${baseFieldPath}.data.customName`, {
      defaultValue: textRef.current.innerText,
    })
  }, [textRef.current])

  return (
    <Editable size="sm" bg="transparent" {...field}>
      <RequirementNameEditor textRef={textRef}>{children}</RequirementNameEditor>
    </Editable>
  )
}

export default RequirementNameEditorWrapper
