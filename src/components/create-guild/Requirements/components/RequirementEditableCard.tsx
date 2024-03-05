import { Button, useDisclosure } from "@chakra-ui/react"
import { RequirementProvider } from "components/[guild]/Requirements/components/RequirementContext"
import { InvalidRequirementErrorBoundary } from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import RequirementImageEditor from "components/[guild]/Requirements/components/RequirementImageEditor"
import RequirementNameAndVisibilityEditor from "components/[guild]/Requirements/components/RequirementNameAndVisibilityEditor"
import { useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import REQUIREMENTS from "requirements"
import BalancyFooter from "./BalancyFooter"
import RemoveRequirementButton from "./RemoveRequirementButton"
import RequirementBaseCard from "./RequirementBaseCard"
import RequirementModalAndDiscardAlert from "./RequirementModalAndDiscardAlert"
import UnsupportedRequirementTypeCard from "./UnsupportedRequirementTypeCard"

const RequirementEditableCard = ({
  index,
  type,
  field,
  removeRequirement,
  updateRequirement,
  isEditDisabled = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const RequirementComponent = REQUIREMENTS[type]?.displayComponent
  const ref = useRef()

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
    <Button ref={ref} size="sm" onClick={onOpen}>
      Edit
    </Button>
  )

  return (
    <>
      <RequirementBaseCard>
        <RequirementProvider requirement={field}>
          <InvalidRequirementErrorBoundary rightElement={rightElement}>
            <RequirementComponent
              fieldRoot={`requirements.${index}`}
              rightElement={rightElement}
              showViewOriginal={showViewOriginal}
              imageWrapper={RequirementImageEditor}
              childrenWrapper={RequirementNameAndVisibilityEditor}
            />
          </InvalidRequirementErrorBoundary>
        </RequirementProvider>

        <RemoveRequirementButton onClick={() => onRemove()} />
      </RequirementBaseCard>

      <FormProvider {...methods}>
        <RequirementModalAndDiscardAlert
          requirementField={field}
          isOpen={isOpen}
          onClose={onClose}
          finalFocusRef={ref}
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
    </>
  )
}

export default RequirementEditableCard
