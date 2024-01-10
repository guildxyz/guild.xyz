import { ModalContent, ModalOverlay, ModalProps } from "@chakra-ui/react"
import { Modal } from "../../../../common/Modal"
import React from "react"
import { GuildPlatform } from "../../../../../types"
import { EditRewardModalContent } from "./EditRewardModalContent"

type Props = {
  guildPlatform: GuildPlatform
} & Omit<ModalProps, "children">

export const EditRewardDescriptionModal: React.FC<Props> = ({
  guildPlatform,
  isOpen,
  onClose,
}: Props): JSX.Element => (
  <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
    <ModalOverlay />
    <ModalContent>
      <EditRewardModalContent guildPlatform={guildPlatform} onClose={onClose} />
    </ModalContent>
  </Modal>
)
