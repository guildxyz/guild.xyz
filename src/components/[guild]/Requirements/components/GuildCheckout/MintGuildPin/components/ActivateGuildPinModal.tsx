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
} from "@chakra-ui/react"
import { ArrowSquareOut } from "@phosphor-icons/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { useRouter } from "next/router"
import { useMintGuildPinContext } from "../../MintGuildPinContext"
import GuildPinImage from "../../components/GuildPinImage"
import ActivateGuildPinForm from "./ActivateGuildPinForm"

const ActivateGuildPinModal = (): JSX.Element => {
  const router = useRouter()
  const { urlName } = useGuild()

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
        <ModalHeader pb={4}>Setup Guild Pin</ModalHeader>

        <ModalBody pb="6">
          <Alert status="info" mb="6" pb="5">
            <AlertIcon />
            <Stack position="relative" top={1}>
              <AlertDescription>
                {error ??
                  (isTooSmallImage
                    ? "Please upload a bigger image in guild settings to activate Guild Pin"
                    : "Onchain badge for members to show support and belonging to this community. Activate it to let members see the reward and mint their Pins!")}
              </AlertDescription>

              {(!!error || isTooSmallImage) && (
                <Button
                  size="sm"
                  w="max-content"
                  rightIcon={<ArrowSquareOut />}
                  onClick={() => router.push(`/${urlName}/dashboard`)}
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
