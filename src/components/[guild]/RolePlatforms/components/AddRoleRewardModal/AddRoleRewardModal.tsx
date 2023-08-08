import {
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import dynamic from "next/dynamic"
import platforms from "platforms/platforms"
import { useRef, useState } from "react"
import { PlatformName } from "types"
import SelectExistingPlatform from "./components/SelectExistingPlatform"

const DynamicDefaultAddPlatformModalContent = dynamic(
  () => import("platforms/DefaultAddPlatformModalContent")
)

const AddRoleRewardModal = ({ isOpen, onClose }) => {
  const [selection, setSelectionOg] = useState<PlatformName>(null)
  const modalRef = useRef(null)

  const setSelection = (platform: PlatformName) => {
    setSelectionOg(platform)
    modalRef.current?.scrollTo({ top: 0 })
  }

  const closeModal = () => {
    setSelection(null)
    onClose()
  }

  const { AddPlatformModalContent } = platforms[selection] ?? {}

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
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
            <DynamicDefaultAddPlatformModalContent
              modalRef={modalRef}
              selection={selection}
              setSelection={setSelection}
              closeModal={closeModal}
              isForExistingRole
            />
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
