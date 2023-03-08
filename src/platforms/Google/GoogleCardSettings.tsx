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
    register(`rolePlatforms.${index}.platformRoleData.role`, {
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
              fieldName={`rolePlatforms.${index}.platformRoleData.role`}
              mimeType={guildPlatform?.platformGuildData?.mimeType}
            />
            {/* <Alert status="info" mt="8">
              <AlertIcon mt="0" />
              <Box>
                <AlertTitle>Can't edit later</AlertTitle>
                <AlertDescription>
                  After you save you'll have to re-add the reward to change access
                  level
                </AlertDescription>
              </Box>
            </Alert> */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GoogleCardSettings
