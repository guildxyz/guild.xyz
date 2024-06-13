import { ModalOverlay } from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import rewards, { modalSizeForPlatform } from "platforms/rewards"

const CreateFormModal = ({ isOpen, onClose, onAdd }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size={modalSizeForPlatform("FORM")}
    scrollBehavior="inside"
    colorScheme="dark"
  >
    <ModalOverlay />
    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
    <rewards.FORM.AddRewardPanel onAdd={onAdd} />
  </Modal>
)

export default CreateFormModal
