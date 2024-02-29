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
import useGuild from "components/[guild]/hooks/useGuild"
import Card from "components/common/Card"
import DataBlock from "components/common/DataBlock"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import useToast from "hooks/useToast"
import { Warning } from "phosphor-react"
import { useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import REQUIREMENTS from "requirements"
import { Requirement as RequirementType } from "types"
import useCreateRequirement from "../hooks/useCreateRequirement"
import useDeleteRequirement from "../hooks/useDeleteRequirement"
import useEditRequirement from "../hooks/useEditRequirement"
import BalancyFooter from "./BalancyFooter"
import ConfirmationAlert from "./ConfirmaionAlert"
import IsNegatedPicker from "./IsNegatedPicker"

type Props = {
  requirement: RequirementType
  roleId: number
  isEditDisabled?: boolean
}

const ExistingRequirementEditableCard = ({
  requirement,
  roleId,
  isEditDisabled = false,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isRequirementDeleteOpen,
    onOpen: onRequirementDeleteOpen,
    onClose: onRequirementDeleteClose,
  } = useDisclosure()
  const RequirementComponent = REQUIREMENTS[requirement.type]?.displayComponent
  const FormComponent = REQUIREMENTS[requirement.type]?.formComponent
  const ref = useRef()
  const closeButtonRef = useRef()
  const removeButtonColor = useColorModeValue("gray.700", "gray.400")
  const methods = useForm({ mode: "all", defaultValues: requirement })

  const showViewOriginal =
    requirement.data?.customName || requirement.data?.customImage

  const { roles } = useGuild()
  const role = roles.find((r) => r.id === roleId)
  const isLastRequirement = role.requirements.length === 1

  const {
    onSubmit: onDeleteRequirementSubmit,
    isLoading: isRequirementDeleteLoading,
    isSigning: isRequirementDeleteSigning,
  } = useDeleteRequirement(roleId, requirement.id)

  const onDeleteRequirement = () =>
    isLastRequirement
      ? onCreateRequirementSubmit({
          type: "FREE",
        })
      : onDeleteRequirementSubmit()

  const toast = useToast()
  const {
    onSubmit: onCreateRequirementSubmit,
    isLoading: isCreateRequirementLoading,
  } = useCreateRequirement(roleId, {
    onSuccess: () => {
      /**
       * Showing a delete toast intentionally, because we call
       * onCreateRequirementSubmit when the user removes the last requirement of the
       * role
       */
      toast({
        status: "success",
        title: "Requirement deleted!",
      })
    },
  })

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

  const requirementDeleteConfitmationAlert = (
    <ConfirmationAlert
      finalFocusRef={closeButtonRef}
      isLoading={
        isRequirementDeleteLoading ||
        isRequirementDeleteSigning ||
        isCreateRequirementLoading
      }
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
            <DataBlock>{requirement.type}</DataBlock>
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

  const rightElement = !isEditDisabled && (
    <Button ref={ref} size="sm" onClick={onOpen}>
      Edit
    </Button>
  )

  return (
    <>
      <Card px="6" py="4" pr="8" pos="relative">
        <RequirementProvider requirement={requirement}>
          <InvalidRequirementErrorBoundary rightElement={rightElement}>
            <RequirementComponent
              fieldRoot={""}
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
            <ModalHeader>{`Edit ${
              REQUIREMENTS[requirement.type].name
            } requirement`}</ModalHeader>
            <ModalBody>
              {REQUIREMENTS[requirement.type].isNegatable && (
                <IsNegatedPicker baseFieldPath={``} />
              )}
              <FormComponent baseFieldPath="" field={requirement} />
            </ModalBody>
            <ModalFooter gap="3">
              <BalancyFooter baseFieldPath={null} />
              <Button
                colorScheme={"green"}
                onClick={methods.handleSubmit(onEditRequirementSubmit)}
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

      {requirementDeleteConfitmationAlert}
    </>
  )
}

export default ExistingRequirementEditableCard
