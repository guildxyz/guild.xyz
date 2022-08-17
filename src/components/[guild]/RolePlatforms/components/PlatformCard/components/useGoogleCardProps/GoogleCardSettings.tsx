import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import PermissionSelection from "components/common/GoogleGuildSetup/components/PermissionSelection"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import capitalize from "utils/capitalize"

const GoogleCardSettings = () => {
  const { platformRoleData, guildPlatform, index } = useRolePlatform()

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <HStack>
        <Text>{`${capitalize(platformRoleData?.role ?? "...")} access`}</Text>
        <Button size="sm" onClick={onOpen}>
          Edit
        </Button>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Documentum settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="info" mb="8">
              <AlertIcon mt="0" />
              <Box>
                <AlertTitle>You can only decrease access level</AlertTitle>
                <AlertDescription>
                  If you change it from writer to reader you'll only be able to
                  change it back by re-adding the reward
                </AlertDescription>
              </Box>
            </Alert>
            <PermissionSelection
              fieldName={`rolePlatforms.${index}.platformRoleData.role`}
              mimeType={guildPlatform?.platformGuildData?.mimeType}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GoogleCardSettings
