import {
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import dynamic from "next/dynamic"
import platforms from "platforms/platforms"
import SelectExistingPlatform from "./components/SelectExistingPlatform"

const DynamicDefaultAddPlatformModalContent = dynamic(
  () => import("platforms/DefaultAddPlatformModalContent")
)

const AddRoleRewardModal = () => {
  const { modalRef, selection, setSelection, isOpen, onClose } =
    useAddRewardContext()

  const { AddPlatformModalContent } = platforms[selection] ?? {}

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      colorScheme="dark"
    >
      <ModalOverlay />
      <ModalContent minH="550px">
        {selection ? (
          AddPlatformModalContent ? (
            <AddPlatformModalContent />
          ) : (
            <DynamicDefaultAddPlatformModalContent isForExistingRole />
          )
        ) : (
          <>
            <ModalHeader>Add reward</ModalHeader>
            <ModalBody ref={modalRef}>
              <SelectExistingPlatform onClose={onClose} />
              <Text fontWeight="bold" mb="3">
                Add new platform
              </Text>
              <PlatformsGrid onSelection={setSelection} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default AddRoleRewardModal
