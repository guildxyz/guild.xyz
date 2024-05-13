import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import { Modal } from "components/common/Modal"
import { GuildPlatform } from "types"

type Props = {
  isOpen: boolean
  onClose: () => void
  guildPlatform: GuildPlatform
}

const EditNftModal = ({ isOpen, onClose, guildPlatform }: Props) => {
  const { chain, contractAddress } = guildPlatform.platformGuildData
  const {} = useNftDetails(chain, contractAddress)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Edit NFT</ModalHeader>
        <ModalBody pt={0}>Edit NFT modal - TODO</ModalBody>
      </ModalContent>
    </Modal>
  )
}
export default EditNftModal
