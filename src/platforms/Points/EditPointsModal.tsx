import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import useEditGuildPlatform from "components/[guild]/AccessHub/hooks/useEditGuildPlatform"
import useGuild from "components/[guild]/hooks/useGuild"
import { Modal } from "components/common/Modal"
import useToast from "hooks/useToast"
import { GuildPlatform } from "types"

type Props = {
  isOpen: boolean
  onClose: () => void
  guildPlatformId: number
  platformGuildData: GuildPlatform["platformGuildData"]
}

const EditPointsModal = ({
  isOpen,
  onClose,
  guildPlatformId,
  platformGuildData,
}: Props) => {
  const { isDetailed } = useGuild()
  const { name, imageUrl, text } = platformGuildData

  const toast = useToast()
  const { onSubmit, isLoading } = useEditGuildPlatform({
    guildPlatformId,
    onSuccess: () => {
      toast({
        status: "success",
        title: "Successfully updated reward",
      })
      onClose()
    },
  })

  const onEditTextRewardSubmit = () => {}

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit points</ModalHeader>
        <ModalCloseButton />

        <ModalBody></ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditPointsModal
