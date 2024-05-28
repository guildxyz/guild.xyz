import { Modal, ModalOverlay } from "@chakra-ui/react"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import rewards, { modalSizeForPlatform } from "platforms/rewards"
import { useEffect } from "react"

const CreateFormModal = ({ isOpen, onClose, onAdd }) => {
  const { setSelection, setStep } = useAddRewardContext()

  useEffect(() => {
    setSelection("FORM")
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={modalSizeForPlatform("FORM")}
      scrollBehavior="inside"
      colorScheme="dark"
    >
      <ModalOverlay />
      <rewards.FORM.AddRewardPanel onAdd={onAdd} />
    </Modal>
  )
}

export default CreateFormModal
