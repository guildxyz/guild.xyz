import { ModalOverlay } from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { modalSizeForPlatform } from "rewards"
import formComponents from "rewards/Forms/components"

const CreateFormModal = ({ isOpen, onClose, onAdd }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size={modalSizeForPlatform("FORM")}
    scrollBehavior="inside"
    colorScheme="dark"
  >
    <ModalOverlay />
    <formComponents.AddRewardPanel onAdd={onAdd} />
  </Modal>
)

export default CreateFormModal
