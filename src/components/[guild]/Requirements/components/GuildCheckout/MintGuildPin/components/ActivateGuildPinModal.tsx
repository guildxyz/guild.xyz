import {
  Alert,
  AlertIcon,
  AlertTitle,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { useEditGuildDrawer } from "components/[guild]/EditGuild/EditGuildDrawerContext"
import { ArrowSquareOut } from "phosphor-react"
import AlphaTag from "../../components/AlphaTag"
import GuildPinImage from "../../components/GuildPinImage"
import { useMintGuildPinContext } from "../../MintGuildPinContext"
import ActivateGuildPinForm from "./ActivateGuildPinForm"

const ActivateGuildPinModal = (): JSX.Element => {
  const { onOpen: onEditGuildDrawerOpen } = useEditGuildDrawer()
  const {
    isActivateModalOpen,
    onActivateModalClose,
    isInvalidImage,
    isTooSmallImage,
    isImageValidating,
    error,
  } = useMintGuildPinContext()
  const setupRequired = isInvalidImage || isTooSmallImage

  return (
    <Modal
      isOpen={isActivateModalOpen}
      onClose={onActivateModalClose}
      colorScheme="dark"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb={4} pr={16}>
          <Text as="span" mr={2}>
            {setupRequired ? "Setup Guild Pin" : "Activate Guild Pin"}
          </Text>
          <AlphaTag />
        </ModalHeader>

        <ModalBody pb="6">
          {!isImageValidating && (error || setupRequired) && (
            <Alert status="info" mb="6" pb="5">
              <AlertIcon />
              <Stack position="relative" top={1}>
                <AlertTitle>
                  {error ??
                    "Please upload a bigger image in guild settings to activate Guild Pin"}
                </AlertTitle>

                <Button
                  size="sm"
                  w="max-content"
                  rightIcon={<ArrowSquareOut />}
                  onClick={onEditGuildDrawerOpen}
                  colorScheme="blue"
                  variant="link"
                >
                  Open settings
                </Button>
              </Stack>
            </Alert>
          )}

          <GuildPinImage />
        </ModalBody>

        <ModalFooter flexDir="column" gap={6}>
          <ActivateGuildPinForm />
          <Text colorScheme="gray" fontSize="sm" textAlign="center">
            Once you activate this Guild Pin, anyone who joins your guild will be
            able to mint it.
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default ActivateGuildPinModal
