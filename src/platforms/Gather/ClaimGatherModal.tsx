import {
  Alert,
  AlertIcon,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
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
  error?: any
}

const ClaimGatherModal = ({
  title,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
}: ModalProps) => {
  const { emails } = useUser()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />

        <ModalHeader pb={0}>{title}</ModalHeader>

        <ModalBody pt={8}>
          {isLoading ? (
            <HStack spacing="6">
              <Spinner />
              <Text>Requesting access...</Text>
            </HStack>
          ) : (
            <>
              <Alert status={!!emails?.emailAddress ? "info" : "warning"} mb={3}>
                <AlertIcon mt={0} />
                {!!emails?.emailAddress ? (
                  <>
                    Access will be granted to the email address associated with your
                    Guild.xyz account.
                  </>
                ) : (
                  <p>
                    <strong>Email address missing!</strong> Please connect the email
                    address you plan to use for Gather to your Guild.xyz account.
                  </p>
                )}
              </Alert>

              <AccountSection>
                <EmailAddress key={"EMAIL"} />
              </AccountSection>

              <Button
                isDisabled={!emails?.emailAddress}
                w="full"
                mt={6}
                onClick={onSubmit}
              >
                Continue with email
              </Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ClaimGatherModal
