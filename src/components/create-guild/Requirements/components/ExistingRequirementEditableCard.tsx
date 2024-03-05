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
import RequirementNameAndVisibilityEditor from "components/[guild]/Requirements/components/RequirementNameAndVisibilityEditor"
import useGuild from "components/[guild]/hooks/useGuild"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import useToast from "hooks/useToast"
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
import RemoveRequirementButton from "./RemoveRequirementButton"
import RequirementBaseCard from "./RequirementBaseCard"
import UnsupportedRequirementTypeCard from "./UnsupportedRequirementTypeCard"

type Props = {
  requirement: RequirementType
  isEditDisabled?: boolean
}

const ExistingRequirementEditableCard = ({
  requirement,
  isEditDisabled = false,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isRequirementDeleteOpen,
    onOpen: onRequirementDeleteOpen,
    onClose: onRequirementDeleteClose,
  } = useDisclosure()
  const {
    isOpen: isDiscardAlertOpen,
    onOpen: onDiscardAlertOpen,
    onClose: onDiscardAlertClose,
  } = useDisclosure()

  const RequirementComponent = REQUIREMENTS[requirement.type]?.displayComponent
  const FormComponent = REQUIREMENTS[requirement.type]?.formComponent
  const ref = useRef()
  const closeButtonRef = useRef()

  const methods = useForm({ mode: "all", defaultValues: requirement })

  const showViewOriginal =
    requirement.data?.customName || requirement.data?.customImage

  const { roles } = useGuild()
  const role = roles.find((r) => r.id === requirement.roleId)
  const isLastRequirement = role.requirements.length === 1

  const {
    onSubmit: onDeleteRequirementSubmit,
    isLoading: isRequirementDeleteLoading,
    isSigning: isRequirementDeleteSigning,
  } = useDeleteRequirement(requirement.roleId, requirement.id)

  // on FREE req creation, the BE automatically deletes other requirements, so we don't have to delete in that case
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
  } = useCreateRequirement(requirement.roleId, {
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

  const onCloseAndClear = () => {
    methods.reset()
    onDiscardAlertClose()
    onClose()
  }

  const { onSubmit: onEditRequirementSubmit, isLoading: isEditRequirementLoading } =
    useEditRequirement(requirement.roleId, {
      onSuccess: () => onClose(),
    })

  const requirementDeleteConfirmationAlert = (
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
        <UnsupportedRequirementTypeCard type={requirement.type}>
          <RemoveRequirementButton
            ref={closeButtonRef}
            onClick={() => onRequirementDeleteOpen()}
          />
        </UnsupportedRequirementTypeCard>

        {requirementDeleteConfirmationAlert}
      </>
    )

  const rightElement = !isEditDisabled && (
    <Button ref={ref} size="sm" onClick={onOpen}>
      Edit
    </Button>
  )

  return (
    <>
      <RequirementBaseCard>
        <RequirementProvider requirement={requirement}>
          <InvalidRequirementErrorBoundary rightElement={rightElement}>
            <RequirementComponent
              rightElement={rightElement}
              showViewOriginal={showViewOriginal}
              imageWrapper={RequirementImageEditor}
              childrenWrapper={RequirementNameAndVisibilityEditor}
            />
          </InvalidRequirementErrorBoundary>
        </RequirementProvider>

        <RemoveRequirementButton
          ref={closeButtonRef}
          onClick={() => onRequirementDeleteOpen()}
        />
      </RequirementBaseCard>

      <Modal
        isOpen={isOpen}
        onClose={methods.formState.isDirty ? onDiscardAlertOpen : onClose}
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
                onClick={methods.handleSubmit((editedReq) =>
                  onEditRequirementSubmit({
                    ...editedReq,
                    /**
                     * Keeping the old data too, because we don't mount e.g. the
                     * `customName` & `customImage` inputs inside this form, so we
                     * would overwrite those on every requirement edit
                     */
                    data: {
                      ...requirement.data,
                      ...editedReq.data,
                    },
                  })
                )}
                ml="auto"
                isLoading={isEditRequirementLoading}
                loadingText="Saving"
                isDisabled={!methods.formState.isDirty}
              >
                Save
              </Button>
            </ModalFooter>
          </FormProvider>
        </ModalContent>
      </Modal>
      <DiscardAlert
        isOpen={isDiscardAlertOpen}
        onClose={onDiscardAlertClose}
        onDiscard={onCloseAndClear}
      />

      {requirementDeleteConfirmationAlert}
    </>
  )
}

export default ExistingRequirementEditableCard
