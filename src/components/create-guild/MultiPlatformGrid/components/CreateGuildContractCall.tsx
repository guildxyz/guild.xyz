import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import CreateNftForm from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm"
import { useFieldArray, useFormContext } from "react-hook-form"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CreateGuildContractCall = ({ isOpen, onClose }: Props): JSX.Element => {
  const { control } = useFormContext()
  const { append } = useFieldArray({
    control,
    name: "guildPlatforms",
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      colorScheme="dark"
      size={"4xl"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create NFT</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateNftForm
            onSuccess={(newGuildPlatform) => {
              append(newGuildPlatform.guildPlatform)
              onClose()
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreateGuildContractCall
