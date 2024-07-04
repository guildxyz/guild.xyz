import { ModalOverlay } from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { modalSizeForPlatform } from "rewards"
import rewardComponents from "rewards/components"

const CreateFormModal = ({ isOpen, onClose, onAdd }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size={modalSizeForPlatform("FORM")}
    scrollBehavior="inside"
    colorScheme="dark"
  >
    <ModalOverlay />
    <rewardComponents.FORM.AddRewardPanel onAdd={onAdd} />
  </Modal>
)

export default CreateFormModal
