import { Icon, IconButton, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { PiPencilSimple } from "react-icons/pi"
import EditNFTDescriptionModal from "rewards/ContractCall/components/EditNFTDescriptionModal"
import { GuildPlatform } from "types"

type Props = {
  guildPlatform: GuildPlatform
}

const EditNFTDescriptionModalButton: React.FC<Props> = ({ guildPlatform }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <IconButton
        icon={<Icon as={PiPencilSimple} />}
        size="sm"
        rounded="full"
        aria-label="Edit description"
        onClick={onOpen}
      />
      <EditNFTDescriptionModal
        guildPlatform={guildPlatform}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  )
}

export default EditNFTDescriptionModalButton
