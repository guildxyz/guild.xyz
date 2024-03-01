import { Icon, IconButton, useDisclosure } from "@chakra-ui/react"
import { PencilSimple } from "@phosphor-icons/react"
import React from "react"
import { GuildPlatform } from "types"
import EditNFTDescriptionModal from "./EditNFTDescriptionModal"

type Props = {
  guildPlatform: GuildPlatform
}

const EditNFTDescriptionModalButton: React.FC<Props> = ({ guildPlatform }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <IconButton
        icon={<Icon as={PencilSimple} />}
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
