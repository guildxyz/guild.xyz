import {
  Button,
  CloseButton,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement from "components/[guild]/Requirements/components/Requirement"
import { RequirementProvider } from "components/[guild]/Requirements/components/RequirementContext"
import Card from "components/common/Card"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import { Warning } from "phosphor-react"
import { useCallback, useRef } from "react"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import REQUIREMENTS from "requirements"
import useDeleteRequirement from "../hooks/useDeleteRequirement"
import BalancyFooter from "./BalancyFooter"
import ConfirmationAlert from "./ConfirmaionAlert"
import IsNegatedPicker from "./IsNegatedPicker"

const RequirementEditableCard = ({
  index,
  type,
  field,
  updateRequirement,
  isEditDisabled = false,
}) => {
  const { formState } = useFormContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isRequirementDeleteOpen,
    onOpen: onRequirementDeleteOpen,
    onClose: onRequirementDeleteClose,
  } = useDisclosure()
  const RequirementComponent = REQUIREMENTS[type]?.displayComponent
  const FormComponent = REQUIREMENTS[type]?.formComponent
  const ref = useRef()
  const closeButtonRef = useRef()
  const removeButtonColor = useColorModeValue("gray.700", "gray.400")
  const methods = useForm({ mode: "all", defaultValues: field })
  const requirementId = useWatch({ name: `requirements.${index}.id` })

  const {
    onSubmit: onDelete,
    isLoading,
    isSigning,
  } = useDeleteRequirement(formState.defaultValues.id, requirementId)

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
    methods.reset(undefined, { keepValues: true })
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

  const requirementDeleteConfitmationAlert = (
    <ConfirmationAlert
      finalFocusRef={closeButtonRef}
      isLoading={isLoading || isSigning}
      isOpen={isRequirementDeleteOpen}
      onClose={onRequirementDeleteClose}
      onConfirm={() => onDelete()}
      title="Delete requirement"
      description="Are you sure you want to delete this requirement?"
      confirmationText="Delete requirement"
    />
  )

  if (!RequirementComponent || !FormComponent)
    return (
      <>
        <Card px="6" py="4" pr="8" pos="relative">
          <Requirement image={<Icon as={Warning} boxSize={5} color="orange.300" />}>
            {`Unsupported requirement type: `}
            <DataBlock>{type}</DataBlock>
          </Requirement>

          <CloseButton
            ref={closeButtonRef}
            position="absolute"
            top={2}
            right={2}
            color={removeButtonColor}
            borderRadius={"full"}
            size="sm"
            onClick={() => onRequirementDeleteOpen()}
            aria-label="Remove requirement"
          />
        </Card>
        {requirementDeleteConfitmationAlert}
      </>
    )

  return (
    <>
      <Card px="6" py="4" pr="8" pos="relative">
        <RequirementProvider requirement={field}>
          <RequirementComponent
            fieldRoot={`requirements.${index}`}
            footer={<BalancyFooter baseFieldPath={`requirements.${index}`} />}
            setValueForBalancy={setValueForBalancy}
            rightElement={
              !isEditDisabled && (
                <Button ref={ref} size="sm" onClick={onOpen}>
                  Edit
                </Button>
              )
            }
          />
        </RequirementProvider>

        <CloseButton
          ref={closeButtonRef}
          position="absolute"
          top={2}
          right={2}
          color={removeButtonColor}
          borderRadius={"full"}
          size="sm"
          onClick={() => onRequirementDeleteOpen()}
          aria-label="Remove requirement"
        />
      </Card>
      <Modal
        isOpen={isOpen}
        onClose={methods.formState.isDirty ? onAlertOpen : onClose}
        scrollBehavior="inside"
        finalFocusRef={ref}
        // colorScheme={"dark"}
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
              <IsNegatedPicker baseFieldPath={``} />
              <FormComponent baseFieldPath={``} field={field} />
            </ModalBody>
            <ModalFooter gap="3">
              <BalancyFooter baseFieldPath={null} />
              <Button colorScheme={"green"} onClick={onSubmit} ml="auto">
                Done
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
      {requirementDeleteConfitmationAlert}
    </>
  )
}

export default RequirementEditableCard
