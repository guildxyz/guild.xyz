import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useRequirements from "components/[guild]/hooks/useRequirements"
import useRole from "components/[guild]/hooks/useRole"
import useToast from "hooks/useToast"
import { Role } from "types"
import useCreateRequirement from "../hooks/useCreateRequirement"
import useDeleteRequirement from "../hooks/useDeleteRequirement"
import ConfirmationAlert from "./ConfirmationAlert"

export const ExistingRequirementDeleteAlert = ({
  requirement,
  isOpen,
  onClose,
  finalFocusRef,
}) => {
  const { data: requirements } = useRequirements(requirement.roleId)
  const isLastRequirement = requirements?.length === 1

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

  const hasLinkedReward = useHasLinkedReward(requirement)

  return (
    <ConfirmationAlert
      finalFocusRef={finalFocusRef}
      isLoading={isDeleteLoading || isDeleteSigning || isCreateRequirementLoading}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => onDeleteRequirement()}
      title="Delete requirement"
      description={
        hasLinkedReward ? (
          <>
            <Alert status="warning">
              <AlertIcon mt={0} />
              <Box>
                <AlertTitle mb="1">
                  This requirement is linked to a dynamic reward
                </AlertTitle>
                <AlertDescription>
                  Deleting this requirement will make the reward unclaimable until it
                  is configured with a new requirement.
                </AlertDescription>
              </Box>
            </Alert>
          </>
        ) : (
          "Are you sure you want to delete this requirement?"
        )
      }
      confirmationText="Delete requirement"
    />
  )
}

const useHasLinkedReward = (requirement) => {
  const { id: guildId } = useGuild()
  const roleResponse: Partial<Role> = useRole(guildId, requirement.roleId)

  return roleResponse.rolePlatforms.some((rp) => {
    const dynamicAmount: any = rp.dynamicAmount
    return dynamicAmount?.operation.input[0].requirementId === requirement.id
  })
}
