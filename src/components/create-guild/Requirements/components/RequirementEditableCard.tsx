import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import { RequirementProvider } from "components/[guild]/Requirements/components/RequirementContext"
import { InvalidRequirementErrorBoundary } from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import RequirementImageEditor from "components/[guild]/Requirements/components/RequirementImageEditor"
import RequirementNameEditor from "components/[guild]/Requirements/components/RequirementNameEditor"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import { useCallback, useRef } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import REQUIREMENTS from "requirements"
import BalancyFooter from "./BalancyFooter"
import IsNegatedPicker from "./IsNegatedPicker"
import RemoveRequirementButton from "./RemoveRequirementButton"
import RequirementBaseCard from "./RequirementBaseCard"
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
  const FormComponent = REQUIREMENTS[type]?.formComponent
  const ref = useRef()

  const methods = useForm({ mode: "all", defaultValues: field })

  const showViewOriginal = field?.data?.customName || field?.data?.customImage

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const onCloseAndClear = () => {
    methods.reset()
    onAlertClose()
    onClose()
  }

  const onSubmit = methods.handleSubmit((data) => {
    updateRequirement(index, data)
    onClose()
  })

  // temporary to set values for balancy so it works without opening the edit modal
  const { setValue } = useFormContext()
  const setValueForBalancy = useCallback(
    (path, data) => {
      setValue(`requirements.${index}.${path}`, data)
    },
    [index, setValue]
  )
  const onRemove = () => removeRequirement(index)

  if (!RequirementComponent || !FormComponent)
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
              footer={<BalancyFooter baseFieldPath={`requirements.${index}`} />}
              setValueForBalancy={setValueForBalancy}
              rightElement={rightElement}
              showViewOriginal={showViewOriginal}
              imageWrapper={RequirementImageEditor}
              childrenWrapper={RequirementNameEditor}
            />
          </InvalidRequirementErrorBoundary>
        </RequirementProvider>

        <RemoveRequirementButton onClick={() => onRemove()} />
      </RequirementBaseCard>

      <Modal
        isOpen={isOpen}
        onClose={methods.formState.isDirty ? onAlertOpen : onClose}
        scrollBehavior="inside"
        finalFocusRef={ref}
      >
        <ModalOverlay />
        <ModalContent>
          <FormProvider {...methods}>
            <ModalCloseButton
              onClick={(e) => {
                e.preventDefault()
                onCloseAndClear()
              }}
            />
            <ModalHeader>{`Edit ${REQUIREMENTS[type].name} requirement`}</ModalHeader>
            <ModalBody>
              {REQUIREMENTS[type].isNegatable && (
                <IsNegatedPicker baseFieldPath={``} />
              )}
              <FormComponent baseFieldPath={``} field={field} />
            </ModalBody>
            <ModalFooter gap="3">
              <BalancyFooter baseFieldPath={null} />
              <Button colorScheme={"green"} onClick={onSubmit} ml="auto">
                Save
              </Button>
            </ModalFooter>
          </FormProvider>
        </ModalContent>
      </Modal>
      <DiscardAlert
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        onDiscard={onCloseAndClear}
      />
    </>
  )
}

export default RequirementEditableCard
