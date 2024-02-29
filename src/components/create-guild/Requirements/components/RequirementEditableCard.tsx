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
import Requirement from "components/[guild]/Requirements/components/Requirement"
import { RequirementProvider } from "components/[guild]/Requirements/components/RequirementContext"
import { InvalidRequirementErrorBoundary } from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import RequirementImageEditor from "components/[guild]/Requirements/components/RequirementImageEditor"
import RequirementNameEditor from "components/[guild]/Requirements/components/RequirementNameEditor"
import Card from "components/common/Card"
import DataBlock from "components/common/DataBlock"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import { Warning } from "phosphor-react"
import { useCallback, useRef } from "react"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import REQUIREMENTS from "requirements"
import useDeleteRequirement from "../hooks/useDeleteRequirement"
import useEditRequirement from "../hooks/useEditRequirement"
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

  const isRole = !!formState?.defaultValues?.id
  const roleId = formState?.defaultValues?.id

  const isPoap = !!formState?.defaultValues?.poapId

  const showViewOriginal = field?.data?.customName || field?.data?.customImage

  const {
    onSubmit: onDeleteRequirement,
    isLoading: isRequirementDeleteLoading,
    isSigning: isRequirementDeleteSigning,
  } = useDeleteRequirement(roleId, requirementId)

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

  const { onSubmit: onEditRequirementSubmit, isLoading: isEditRequirementLoading } =
    useEditRequirement(roleId, {
      onSuccess: () => onClose(),
    })

  const onSubmit = methods.handleSubmit((data) => {
    if (roleId) {
      onEditRequirementSubmit(data)
    } else {
      updateRequirement(index, data)
      onClose()
    }
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
    if ((isRole || isPoap) && !!requirementId) {
      onRequirementDeleteOpen()
    } else {
      removeRequirement(index)
    }
  }

  const requirementDeleteConfitmationAlert = (
    <ConfirmationAlert
      finalFocusRef={closeButtonRef}
      isLoading={isRequirementDeleteLoading || isRequirementDeleteSigning}
      isOpen={isRequirementDeleteOpen}
      onClose={onRequirementDeleteClose}
      onConfirm={() => onDeleteRequirement()}
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
        {requirementId && requirementDeleteConfitmationAlert}
      </>
    )

  const rightElement = !isEditDisabled && (
    <Button ref={ref} size="sm" onClick={onOpen}>
      Edit
    </Button>
  )

  return (
    <>
      <Card
        px="6"
        py="4"
        pr="8"
        pos="relative"
        sx={{
          ":has([data-req-name-editor]) [data-req-image-editor]": {
            opacity: 1,
          },
        }}
      >
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
              <Button
                colorScheme={"green"}
                onClick={onSubmit}
                ml="auto"
                isLoading={isEditRequirementLoading}
                loadingText="Saving"
              >
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
      {requirementId && requirementDeleteConfitmationAlert}
    </>
  )
}

export default RequirementEditableCard
