import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { AccountSection } from "components/common/Layout/components/Account/components/AccountModal/components/AccountConnections"
import EmailAddress from "components/common/Layout/components/Account/components/AccountModal/components/SocialAccount/EmailAddress"
import { Spinner } from "phosphor-react"

type ModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  isLoading: boolean
}

const ClaimGatherModal = ({
  title,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ModalProps) => {
  const { emails } = useUser()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />

        <ModalHeader>{title}</ModalHeader>

        <ModalBody pt="0" pb="8">
          {isLoading ? (
            <HStack spacing="6">
              <Spinner />
              <Text>Requesting access...</Text>
            </HStack>
          ) : (
            <>
              {!!emails?.emailAddress ? (
                <Text mb="4">
                  Access will be granted to your connected email address:
                </Text>
              ) : (
                <Text mb="4">
                  Please connect the email address you plan to use Gather with to
                  your account!
                </Text>
              )}

              <AccountSection>
                <EmailAddress key={"EMAIL"} />
              </AccountSection>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={!emails?.emailAddress}
            w="full"
            onClick={onSubmit}
            colorScheme={"GATHER_TOWN"}
          >
            Continue with email
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ClaimGatherModal
