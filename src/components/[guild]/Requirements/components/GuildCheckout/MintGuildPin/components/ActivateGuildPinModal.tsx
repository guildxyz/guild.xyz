import {
  Alert,
  AlertDescription,
  AlertIcon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useEditGuildDrawer } from "components/[guild]/EditGuild/EditGuildDrawerContext"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { ArrowSquareOut } from "phosphor-react"
import { useMintGuildPinContext } from "../../MintGuildPinContext"
import AlphaTag from "../../components/AlphaTag"
import GuildPinImage from "../../components/GuildPinImage"
import ActivateGuildPinForm from "./ActivateGuildPinForm"

const ActivateGuildPinModal = (): JSX.Element => {
  const { onOpen: onEditGuildDrawerOpen } = useEditGuildDrawer()
  const { isActivateModalOpen, onActivateModalClose, isTooSmallImage, error } =
    useMintGuildPinContext()

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
            Setup Guild Pin
          </Text>
          <AlphaTag />
        </ModalHeader>

        <ModalBody pb="6">
          <Alert status="info" mb="6" pb="5">
            <AlertIcon />
            <Stack position="relative" top={1}>
              <AlertDescription>
                {error ??
                  (isTooSmallImage
                    ? "Please upload a bigger image in guild settings to activate Guild Pin"
                    : "Onchain badge for members, that shows their support and belonging to this community. Activate it, so members can mint it and shill your guild onchain!")}
              </AlertDescription>

              {(!!error || isTooSmallImage) && (
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
              )}
            </Stack>
          </Alert>

          <GuildPinImage />
        </ModalBody>

        <ModalFooter flexDir="column" gap={6}>
          <ActivateGuildPinForm />
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default ActivateGuildPinModal
