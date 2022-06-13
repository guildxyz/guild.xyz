import {
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useServerData from "hooks/useServerData"
import { useMemo } from "react"
import ChannelsToGate from "../../ChannelsToGate"
import { useRolePlatrform } from "../../RolePlatformProvider"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  roleId: string
}

const Modal = ({ isOpen, onClose }: ModalProps) => {
  const { discordRoleId } = useRolePlatrform()

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Discord Settings</ModalHeader>
        <ModalBody>
          <ChannelsToGate roleId={discordRoleId} />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" onClick={onClose}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  )
}

const Label = () => {
  const { nativePlatformId, discordRoleId } = useRolePlatrform()
  const { authorization } = useDCAuth("guilds")

  const {
    data: { categories },
  } = useServerData(nativePlatformId, { authorization })

  const gatedChannelsCount = useMemo(
    () =>
      categories.reduce(
        (acc, category) =>
          acc +
          category.channels.reduce(
            (channelAcc, channel) =>
              channelAcc + +channel.roles.includes(discordRoleId),
            0
          ),
        0
      ),
    [categories]
  )

  return (
    <Text>
      Create a new role, {authorization ? gatedChannelsCount : ""} gated channel
      {gatedChannelsCount === 1 ? "" : "s"}
    </Text>
  )
}

export { Modal, Label }
