import { ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import rewards, {
  AddRewardPanelProps,
  modalSizeForPlatform,
} from "platforms/rewards"
import { useWatch } from "react-hook-form"
import { RoleFormType } from "types"
import SelectRewardPanel from "./SelectRewardPanel"
import SelectExistingPlatform from "./components/SelectExistingPlatform"

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
      size={
        step === "SELECT_ROLE"
          ? "2xl"
          : isRewardSetupStep
          ? modalSizeForPlatform(selection)
          : "4xl"
      }
      scrollBehavior="inside"
      colorScheme="dark"
    >
      <ModalOverlay />

      {step === "HOME" && (
        <SelectRewardPanel
          disabledRewards={{
            ERC20: `Token rewards cannot be added to existing roles. Please use the "Add reward" button in the top right corner of the Guild page to create the reward with a new role.`,
          }}
        >
          <SelectExistingPlatform
            onClose={onClose}
            onSelect={(selectedRolePlatform) => append?.(selectedRolePlatform)}
          />
          <Text fontWeight="bold" mb="3">
            Add new reward
          </Text>
        </SelectRewardPanel>
      )}

      {isRewardSetupStep && <AddRewardPanel onAdd={handleAddReward} skipSettings />}

      <DiscardAlert
        isOpen={isDiscardAlertOpen}
        onClose={onDiscardAlertClose}
        onDiscard={handleDiscard}
      />
    </Modal>
  )
}

export default AddRoleRewardModal
