import {
  HStack,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { ArrowLeft } from "phosphor-react"
import SelectRoleOrSetRequirements from "platforms/components/SelectRoleOrSetRequirements"
import rewards, { AddRewardPanelProps } from "platforms/rewards"
import { useWatch } from "react-hook-form"
import { RoleFormType } from "types"
import SelectExistingPlatform from "./components/SelectExistingPlatform"

type Props = {
  append: AddRewardPanelProps["onAdd"]
}

const AddRoleRewardModal = ({ append }: Props) => {
  const { modalRef, selection, setSelection, step, setStep, isOpen, onClose } =
    useAddRewardContext()
  const [isAddRewardPanelDirty, setIsAddRewardPanelDirty] =
    useAddRewardDiscardAlert()
  const {
    isOpen: isDiscardAlertOpen,
    onOpen: onDiscardAlertOpen,
    onClose: onDiscardAlertClose,
  } = useDisclosure()

  const goBack = () => {
    setIsAddRewardPanelDirty(false)
    if (step === "SELECT_ROLE") {
      setStep("HOME")
    } else {
      setSelection(null)
    }
  }

  const { AddRewardPanel } = rewards[selection] ?? {}

  const roleVisibility = useWatch<RoleFormType, "visibility">({ name: "visibility" })

  return (
    <Modal
      isOpen={isOpen}
      onClose={isAddRewardPanelDirty ? onDiscardAlertOpen : onClose}
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
              {selection ? `Add ${rewards[selection].name} reward` : "Add reward"}
            </Text>
          </HStack>
        </ModalHeader>

        <ModalBody ref={modalRef} className="custom-scrollbar">
          {selection && step === "SELECT_ROLE" ? (
            <SelectRoleOrSetRequirements
              selectedPlatform={selection}
              isRoleSelectorDisabled={selection === "ERC20"}
            />
          ) : AddRewardPanel ? (
            <AddRewardPanel
              onAdd={(data) => {
                append({ ...data, visibility: roleVisibility })
                onClose()
              }}
              skipSettings
            />
          ) : (
            <>
              <SelectExistingPlatform
                onClose={onClose}
                onSelect={(selectedRolePlatform) => append(selectedRolePlatform)}
              />
              <Text fontWeight="bold" mb="3">
                Add new reward
              </Text>
              <PlatformsGrid
                onSelection={setSelection}
                disabledRewards={{
                  ERC20: `Token rewards cannot be added to existing roles. Please use the "Add reward" button in the top right corner of the Guild page to create the reward with a new role.`,
                }}
              />
            </>
          )}
        </ModalBody>
      </ModalContent>
      <DiscardAlert
        isOpen={isDiscardAlertOpen}
        onClose={onDiscardAlertClose}
        onDiscard={() => {
          onClose()
          onDiscardAlertClose()
          setIsAddRewardPanelDirty(false)
        }}
      />
    </Modal>
  )
}

export default AddRoleRewardModal
