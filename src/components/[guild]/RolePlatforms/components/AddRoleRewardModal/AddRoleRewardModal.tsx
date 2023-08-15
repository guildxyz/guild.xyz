import {
  HStack,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import { ArrowLeft } from "phosphor-react"
import SelectRoleOrSetRequirements from "platforms/components/SelectRoleOrSetRequirements"
import platforms from "platforms/platforms"
import SelectExistingPlatform from "./components/SelectExistingPlatform"

const AddRoleRewardModal = () => {
  const { modalRef, selection, setSelection, step, setStep, isOpen, onClose } =
    useAddRewardContext()
  const goBack = () => {
    if (step === "ROLES_REQUIREMENTS") {
      setStep("HOME")
    } else {
      setSelection(null)
    }
  }

  const { AddPlatformPanel } = platforms[selection] ?? {}

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
        <ModalCloseButton />
        <ModalHeader>
          <HStack>
            {selection && (
              <IconButton
                rounded="full"
                aria-label="Back"
                size="sm"
                mb="-3px"
                icon={<ArrowLeft size={20} />}
                variant="ghost"
                onClick={goBack}
              />
            )}
            <Text>
              {selection ? `Add ${platforms[selection].name} reward` : "Add reward"}
            </Text>
          </HStack>
        </ModalHeader>

        <ModalBody ref={modalRef} className="custom-scrollbar">
          {selection && step === "ROLES_REQUIREMENTS" ? (
            <SelectRoleOrSetRequirements selectedPlatform={selection} />
          ) : AddPlatformPanel ? (
            <AddPlatformPanel onSuccess={onClose} skipSettings />
          ) : (
            <>
              <SelectExistingPlatform onClose={onClose} />
              <Text fontWeight="bold" mb="3">
                Add new platform
              </Text>
              <PlatformsGrid onSelection={setSelection} />
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AddRoleRewardModal
