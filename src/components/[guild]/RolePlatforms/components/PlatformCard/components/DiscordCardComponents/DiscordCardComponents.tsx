import { VStack } from "@chakra-ui/react"
import BaseLabel from "./components/BaseLabel"
import BaseModal, { ModalProps } from "./components/BaseModal"
import ChannelsToGate from "./components/ChannelsToGate"
import RoleToManage from "./components/RoleToManage"

const EditModal = ({ isOpen, onClose }: ModalProps) => (
  <BaseModal {...{ isOpen, onClose }}>
    <ChannelsToGate />
  </BaseModal>
)

const EditModalForNewPlatform = ({ isOpen, onClose }: ModalProps) => (
  <BaseModal {...{ isOpen, onClose }} minW="3xl">
    <VStack spacing={5} alignItems="start">
      <RoleToManage />
      <ChannelsToGate />
    </VStack>
  </BaseModal>
)

const Label = () => <BaseLabel />
const LabelForNewPlatform = () => <BaseLabel isAdded />

const EditDiscordPlatform = {
  EditModal,
  Label,
  NewPlatform: { Label: LabelForNewPlatform, EditModal: EditModalForNewPlatform },
}

export default EditDiscordPlatform
