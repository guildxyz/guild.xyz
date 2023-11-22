import {
  Editable,
  EditablePreview,
  Input,
  useEditableControls,
} from "@chakra-ui/react"
import EditableControls from "components/[guild]/Onboarding/components/SummonMembers/components/PanelBody/components/EditableControls"
import { PropsWithChildren } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useRequirementContext } from "./RequirementContext"

const RequirementNameEditor = ({ children }: PropsWithChildren<unknown>) => {
  const { id } = useRequirementContext()

  const { isEditing } = useEditableControls()

  const { register, control } = useFormContext()
  const requirements = useWatch({ name: "requirements", control })
  const index = requirements.findIndex((requirement) => requirement.id === id)

  return (
    <>
      <EditablePreview />
      {isEditing ? (
        <Input
          {...register(`requirements.${index}.data.customName`)}
          variant="unstyled"
        />
      ) : (
        children
      )}
      <EditableControls variant="unstyled" display="flex" alignItems="center" />
    </>
  )
}

const RequirementNameEditorWrapper = ({ children }: PropsWithChildren<unknown>) => (
  <Editable
    size="sm"
    bg="transparent"
    borderWidth={1}
    borderRadius="lg"
    display="flex"
  >
    <RequirementNameEditor>{children}</RequirementNameEditor>
  </Editable>
)

export default RequirementNameEditorWrapper
