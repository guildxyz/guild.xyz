import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  useDisclosure,
} from "@chakra-ui/react"
import {
  RequirementProvider,
  useRequirementContext,
} from "components/[guild]/Requirements/components/RequirementContext"
import { InvalidRequirementErrorBoundary } from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import RequirementImageEditor from "components/[guild]/Requirements/components/RequirementImageEditor"
import RequirementNameEditor from "components/[guild]/Requirements/components/RequirementNameEditor"
import SetVisibility from "components/[guild]/SetVisibility"
import useVisibilityModalProps from "components/[guild]/SetVisibility/hooks/useVisibilityModalProps"
import useRequirements from "components/[guild]/hooks/useRequirements"
import useToast from "hooks/useToast"
import { PropsWithChildren, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import REQUIREMENTS from "requirements"
import { Requirement as RequirementType } from "types"
import mapRequirement from "utils/mapRequirement"
import useCreateRequirement from "../hooks/useCreateRequirement"
import useDeleteRequirement from "../hooks/useDeleteRequirement"
import useEditRequirement from "../hooks/useEditRequirement"
import BalancyFooter from "./BalancyFooter"
import ConfirmationAlert from "./ConfirmationAlert"
import RemoveRequirementButton from "./RemoveRequirementButton"
import RequirementBaseCard from "./RequirementBaseCard"
import RequirementEditModal, {
  RequirementEditModalProps,
} from "./RequirementEditModal"
import UnsupportedRequirementTypeCard from "./UnsupportedRequirementTypeCard"

type Props = {
  requirement: RequirementType
  isEditDisabled?: boolean
}

const ExistingRequirementEditableCard = ({
  requirement,
  isEditDisabled = false,
}: Props) => {
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()

  const RequirementComponent = REQUIREMENTS[requirement.type]?.displayComponent
  const editButtonRef = useRef()
  const removeButtonRef = useRef()

  const showViewOriginal =
    requirement.data?.customName || requirement.data?.customImage

  const { data: requirements } = useRequirements(requirement.roleId)
  const isLastRequirement = requirements?.length === 1

  const {
    onSubmit: onDeleteRequirementSubmit,
    isLoading: isDeleteLoading,
    isSigning: isDeleteSigning,
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

  const DeleteConfirmationAlert = (
    <ConfirmationAlert
      finalFocusRef={removeButtonRef}
      isLoading={isDeleteLoading || isDeleteSigning || isCreateRequirementLoading}
      isOpen={isDeleteOpen}
      onClose={onDeleteClose}
      onConfirm={() => onDeleteRequirement()}
      title="Delete requirement"
      description={
        requirement.type === "GUILD_SNAPSHOT" ? (
          <Alert status="warning">
            <AlertIcon mt={0} />
            <Box>
              <AlertTitle>
                This requirement may be linked to a token reward
              </AlertTitle>
              <AlertDescription>
                Deleting this requirement will make the reward unclaimable until it
                is configured with a new snapshot
              </AlertDescription>
            </Box>
          </Alert>
        ) : (
          "Are you sure you want to delete this requirement?"
        )
      }
      confirmationText="Delete requirement"
    />
  )

  if (!RequirementComponent)
    return (
      <>
        <UnsupportedRequirementTypeCard type={requirement.type}>
          <RemoveRequirementButton
            ref={removeButtonRef}
            onClick={() => onDeleteOpen()}
          />
        </UnsupportedRequirementTypeCard>

        {DeleteConfirmationAlert}
      </>
    )

  const rightElement = !isEditDisabled && (
    <Button ref={editButtonRef} size="sm" onClick={onEditOpen}>
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
              imageWrapper={RequirementImageEditorWithSave}
              childrenWrapper={RequirementNameEditorWithSave}
            />
          </InvalidRequirementErrorBoundary>
        </RequirementProvider>

        <RemoveRequirementButton
          ref={removeButtonRef}
          onClick={() => onDeleteOpen()}
        />
      </RequirementBaseCard>

      {!isEditDisabled && (
        <ExistingRequirementEditModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          requirementField={requirement}
          finalFocusRef={editButtonRef}
        />
      )}

      {DeleteConfirmationAlert}
    </>
  )
}

const ExistingRequirementEditModal = ({
  requirementField: requirement,
  isOpen,
  onClose,
  finalFocusRef,
}: Omit<RequirementEditModalProps, "footer">) => {
  const methods = useForm({ mode: "all", defaultValues: requirement })

  const { onSubmit: onEditRequirementSubmit, isLoading: isEditRequirementLoading } =
    useEditRequirement(requirement.roleId, {
      onSuccess: (editedRequirement) => {
        methods.reset(mapRequirement(editedRequirement))
        onClose()
      },
    })

  return (
    <FormProvider {...methods}>
      <RequirementEditModal
        requirementField={requirement}
        {...{ isOpen, onClose, finalFocusRef }}
        footer={
          <>
            <BalancyFooter baseFieldPath={null} />
            <Button
              colorScheme="green"
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
          </>
        }
      />
    </FormProvider>
  )
}

const RequirementImageEditorWithSave = ({
  children,
}: PropsWithChildren<unknown>) => {
  const requirement = useRequirementContext()
  const { onSubmit: onEditRequirementSubmit, isLoading: isEditRequirementLoading } =
    useEditRequirement(requirement.roleId)

  return (
    <RequirementImageEditor
      onSave={(customImage) =>
        onEditRequirementSubmit({
          ...requirement,
          data: {
            ...requirement.data,
            customImage,
          },
        })
      }
      isLoading={isEditRequirementLoading}
    >
      {children}
    </RequirementImageEditor>
  )
}

const RequirementNameEditorWithSave = ({ children }: PropsWithChildren<unknown>) => {
  const requirement = useRequirementContext()

  const setVisibilityModalProps = useVisibilityModalProps()

  const { onSubmit: onEditRequirementSubmit, isLoading: isEditRequirementLoading } =
    useEditRequirement(requirement.roleId, {
      onSuccess: () => setVisibilityModalProps.onClose(),
    })

  const onEditVisibilitySubmit = (visibilityData) => {
    const editedData = {
      ...requirement,
      ...visibilityData,
    }

    onEditRequirementSubmit(editedData)
  }

  return (
    <RequirementNameEditor
      onSave={(customName) =>
        onEditRequirementSubmit({
          ...requirement,
          data: { ...requirement.data, customName },
        })
      }
      rightElement={
        <SetVisibility
          entityType="requirement"
          mt={-0.5}
          defaultValues={{
            visibility: requirement.visibility,
            visibilityRoleId: requirement.visibilityRoleId,
          }}
          onSave={onEditVisibilitySubmit}
          isLoading={isEditRequirementLoading}
          {...setVisibilityModalProps}
        />
      }
      isLoading={isEditRequirementLoading}
    >
      {children}
    </RequirementNameEditor>
  )
}

export default ExistingRequirementEditableCard
