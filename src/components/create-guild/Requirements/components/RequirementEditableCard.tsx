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
import useIsV2 from "hooks/useIsV2"
import { Warning } from "phosphor-react"
import { useCallback, useRef } from "react"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import REQUIREMENTS from "requirements"
import useDeletePoapRequirement from "../hooks/useDeletePoapRequirement"
import useDeleteRequirement from "../hooks/useDeleteRequirement"
import BalancyFooter from "./BalancyFooter"
import ConfirmationAlert from "./ConfirmaionAlert"
import IsNegatedPicker from "./IsNegatedPicker"

const RequirementEditableCard = ({
  index,
  type,
  field,
  removeRequirement,
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
  const isV2 = useIsV2()

  const isRole = !!formState?.defaultValues?.id
  const roleId = formState?.defaultValues?.id

  const isPoap = !!formState?.defaultValues?.poapId
  const poapId = formState?.defaultValues?.poapId

  const {
    onSubmit: onDeleteRequirement,
    isLoading: isRequirementDeleteLoading,
    isSigning: isRequirementDeleteSigning,
  } = useDeleteRequirement(roleId, requirementId)

  const {
    onSubmit: onDeletePoapRequirement,
    isLoading: isPoapRequirementDeleteLoading,
    isSigning: isPoapRequirementDeleteSigning,
  } = useDeletePoapRequirement(poapId, requirementId)

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
  const onRemove = () => {
    if (isV2 && (isRole || isPoap) && !!requirementId) {
      onRequirementDeleteOpen()
    } else {
      removeRequirement(index)
    }
  }

  const onConfirmDelete = () => {
    if (isPoap) {
      onDeletePoapRequirement()
    } else {
      onDeleteRequirement()
    }
  }

  const requirementDeleteConfitmationAlert = (
    <ConfirmationAlert
      finalFocusRef={closeButtonRef}
      isLoading={
        isPoapRequirementDeleteLoading ||
        isPoapRequirementDeleteSigning ||
        isRequirementDeleteLoading ||
        isRequirementDeleteSigning
      }
      isOpen={isRequirementDeleteOpen}
      onClose={onRequirementDeleteClose}
      onConfirm={() => onConfirmDelete()}
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
            onClick={() => onRemove()}
            aria-label="Remove requirement"
          />
        </Card>
        {isV2 && requirementId && requirementDeleteConfitmationAlert}
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
          onClick={onRemove}
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
      {isV2 && requirementId && requirementDeleteConfitmationAlert}
    </>
  )
}

export default RequirementEditableCard
