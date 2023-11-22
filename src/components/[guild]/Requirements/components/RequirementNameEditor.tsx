import {
  Box,
  Editable,
  EditablePreview,
  Input,
  Text,
  useEditableControls,
} from "@chakra-ui/react"
import EditableControls from "components/[guild]/Onboarding/components/SummonMembers/components/PanelBody/components/EditableControls"
import { PropsWithChildren, useEffect, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useRequirementContext } from "./RequirementContext"

const RequirementNameEditor = ({ children }: PropsWithChildren<unknown>) => {
  const { id } = useRequirementContext()

  const { isEditing } = useEditableControls()

  const { register, control, getValues, setValue } = useFormContext()
  const requirements = useWatch({ name: "requirements", control })
  const index = requirements.findIndex((requirement) => requirement.id === id)
  const textRef = useRef(null)

  useEffect(() => {
    if (isEditing && !getValues(`requirements.${index}.data.customName`)) {
      setValue(`requirements.${index}.data.customName`, textRef.current?.innerText, {
        shouldDirty: true,
      })
    }
  }, [isEditing])

  return (
    <Box
      borderWidth={isEditing ? 1 : 0}
      borderRadius="lg"
      display="flex"
      pl={isEditing ? 2 : 0}
    >
      <EditablePreview />
      {isEditing && (
        <Input
          {...register(`requirements.${index}.data.customName`)}
          variant="unstyled"
        />
      )}
      <Text
        wordBreak="break-word"
        ref={textRef}
        display={isEditing ? "none" : "block"}
      >
        {children}
      </Text>
      <EditableControls variant="unstyled" display="flex" alignItems="center" />
    </Box>
  )
}

const RequirementNameEditorWrapper = ({ children }: PropsWithChildren<unknown>) => (
  <Editable size="sm" bg="transparent">
    <RequirementNameEditor>{children}</RequirementNameEditor>
  </Editable>
)

export default RequirementNameEditorWrapper
