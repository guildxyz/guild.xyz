import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import PermissionSelection from "components/common/GoogleGuildSetup/components/PermissionSelection"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

const GoogleCardSettings = () => {
  const { guildPlatform, index } = useRolePlatform()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { register } = useFormContext()

  useEffect(() => {
    if (!register) return
    register(`rolePlatforms.${index}.platformRoleId`, {
      value:
        guildPlatform?.platformGuildData?.mimeType ===
        "application/vnd.google-apps.form"
          ? "writer"
          : "reader",
    })
  }, [register])

  return (
    <>
      <Button size="sm" onClick={onOpen}>
        Edit
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Documentum settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PermissionSelection
              fieldName={`rolePlatforms.${index}.platformRoleId`}
              mimeType={guildPlatform?.platformGuildData?.mimeType}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GoogleCardSettings
