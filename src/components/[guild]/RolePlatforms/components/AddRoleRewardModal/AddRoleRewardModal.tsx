import { ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import SelectRoleOrSetRequirements from "platforms/components/SelectRoleOrSetRequirements"
import rewards, { AddRewardPanelProps } from "platforms/rewards"
import { useWatch } from "react-hook-form"
import { RoleFormType } from "types"
import SelectRewardPanel from "./SelectRewardPanel"

type Props = {
  append: AddRewardPanelProps["onAdd"]
}

const AddRoleRewardModal = ({ append }: Props) => {
  const { selection, step, isOpen, onClose } = useAddRewardContext()

  const {
    isOpen: isDiscardAlertOpen,
    onOpen: onDiscardAlertOpen,
    onClose: onDiscardAlertClose,
  } = useDisclosure()

  const { AddRewardPanel } = rewards[selection] ?? {}

  const roleVisibility = useWatch<RoleFormType, "visibility">({ name: "visibility" })
  const [isAddRewardPanelDirty, setIsAddRewardPanelDirty] =
    useAddRewardDiscardAlert()
  const isRewardSetupStep = selection && step !== "HOME" && step !== "SELECT_ROLE"

  const handleAddReward = (data: any) => {
    append({ ...data, visibility: roleVisibility })
    onClose()
  }

  const handleClose = () => {
    if (isAddRewardPanelDirty) {
      onDiscardAlertOpen()
    } else {
      onClose()
    }
  }

  const handleDiscard = () => {
    onClose()
    onDiscardAlertClose()
    setIsAddRewardPanelDirty(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="4xl"
      scrollBehavior="inside"
      colorScheme="dark"
    >
      <ModalOverlay />
      <ModalContent minH="550px">
        {step === "HOME" && <SelectRewardPanel append={append} />}

        {isRewardSetupStep && (
          <AddRewardPanel onAdd={handleAddReward} skipSettings />
        )}

        {selection && step === "SELECT_ROLE" && (
          <SelectRoleOrSetRequirements
            selectedPlatform={selection}
            isRoleSelectorDisabled={selection === "ERC20"}
          />
        )}
      </ModalContent>
      <DiscardAlert
        isOpen={isDiscardAlertOpen}
        onClose={onDiscardAlertClose}
        onDiscard={handleDiscard}
      />
    </Modal>
  )
}

export default AddRoleRewardModal
