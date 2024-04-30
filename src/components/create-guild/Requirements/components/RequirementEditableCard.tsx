import { Button, useDisclosure } from "@chakra-ui/react"
import { RequirementProvider } from "components/[guild]/Requirements/components/RequirementContext"
import { InvalidRequirementErrorBoundary } from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import RequirementImageEditor from "components/[guild]/Requirements/components/RequirementImageEditor"
import RequirementNameEditor from "components/[guild]/Requirements/components/RequirementNameEditor"
import SetVisibility from "components/[guild]/SetVisibility"
import useVisibilityModalProps from "components/[guild]/SetVisibility/hooks/useVisibilityModalProps"
import dynamic from "next/dynamic"
import { PropsWithChildren, memo, useRef } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import REQUIREMENTS, { RequirementType } from "requirements"
import { Requirement, RoleFormType } from "types"
import BalancyFooter from "./BalancyFooter"
import RemoveRequirementButton from "./RemoveRequirementButton"
import RequirementBaseCard from "./RequirementBaseCard"
import UnsupportedRequirementTypeCard from "./UnsupportedRequirementTypeCard"

const DynamicRequirementEditModal = dynamic(() => import("./RequirementEditModal"))

type Props = {
  index: number
  type: RequirementType
  field: Requirement
  removeRequirement: (index: number) => void
  updateRequirement: (index: number, data: Requirement) => void
  isEditDisabled?: boolean
}

const RequirementEditableCard = ({
  index,
  type,
  field,
  removeRequirement,
  updateRequirement,
  isEditDisabled = false,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const RequirementComponent = REQUIREMENTS[type]?.displayComponent
  const editButtonRef = useRef()

  const { setValue } = useFormContext<RoleFormType>()
  const methods = useForm({ mode: "all", defaultValues: field })

  const showViewOriginal = field?.data?.customName || field?.data?.customImage

  const onSubmit = methods.handleSubmit((data) => {
    updateRequirement(index, data)
    onClose()
  })

  const onRemove = () => removeRequirement(index)

  if (!RequirementComponent)
    return (
      <UnsupportedRequirementTypeCard type={type}>
        <RemoveRequirementButton onClick={() => onRemove()} />
      </UnsupportedRequirementTypeCard>
    )

  const rightElement = !isEditDisabled && (
    <Button ref={editButtonRef} size="sm" onClick={onOpen}>
      Edit
    </Button>
  )

  const RequirementImageEditorWithSetValue = memo(
    ({ children }: PropsWithChildren<unknown>) => (
      <RequirementImageEditor
        onSave={(customImage) =>
          setValue?.(`requirements.${index}.data.customImage`, customImage, {
            shouldDirty: true,
          })
        }
      >
        {children}
      </RequirementImageEditor>
    )
  )

  const RequirementNameEditorWithSetValue = memo(
    ({ children }: PropsWithChildren<unknown>) => {
      const setVisibilityModalProps = useVisibilityModalProps()

      return (
        <RequirementNameEditor
          onSave={(customName) => {
            setValue(`requirements.${index}.data.customName`, customName, {
              shouldDirty: true,
            })
          }}
          rightElement={
            <SetVisibility
              entityType="requirement"
              mt={-0.5}
              defaultValues={{
                visibility: field.visibility,
                visibilityRoleId: field.visibilityRoleId,
              }}
              onSave={({ visibility, visibilityRoleId }) => {
                setValue(`requirements.${index}.visibility`, visibility, {
                  shouldDirty: true,
                })
                setValue(
                  `requirements.${index}.visibilityRoleId`,
                  visibilityRoleId,
                  {
                    shouldDirty: true,
                  }
                )
                setVisibilityModalProps.onClose()
              }}
              {...setVisibilityModalProps}
            />
          }
        >
          {children}
        </RequirementNameEditor>
      )
    }
  )

  return (
    <>
      <RequirementBaseCard>
        <RequirementProvider requirement={field}>
          <InvalidRequirementErrorBoundary rightElement={rightElement}>
            <RequirementComponent
              rightElement={rightElement}
              showViewOriginal={showViewOriginal}
              imageWrapper={RequirementImageEditorWithSetValue}
              childrenWrapper={RequirementNameEditorWithSetValue}
            />
          </InvalidRequirementErrorBoundary>
        </RequirementProvider>

        <RemoveRequirementButton onClick={() => onRemove()} />
      </RequirementBaseCard>

      {!isEditDisabled && (
        <FormProvider {...methods}>
          <DynamicRequirementEditModal
            requirementField={field}
            isOpen={isOpen}
            onClose={onClose}
            finalFocusRef={editButtonRef}
            footer={
              <>
                <BalancyFooter baseFieldPath={null} />
                <Button colorScheme="green" onClick={onSubmit} ml="auto">
                  Done
                </Button>
              </>
            }
          />
        </FormProvider>
      )}
    </>
  )
}

export default RequirementEditableCard
