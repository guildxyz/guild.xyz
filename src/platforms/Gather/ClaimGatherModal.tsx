import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
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
import { AccountSection } from "components/common/LegacyLayout/components/Account/components/AccountModal/components/AccountConnections"
import EmailAddress from "components/common/LegacyLayout/components/Account/components/AccountModal/components/SocialAccount/EmailAddress"
import { ArrowSquareOut } from "phosphor-react"

type ModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  isLoading: boolean
  claimed: boolean
  gatherSpaceUrl: string
}

const ClaimGatherModal = ({
  title,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  claimed,
  gatherSpaceUrl,
}: ModalProps) => {
  const { emails } = useUser()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />

        <ModalHeader>{title}</ModalHeader>

        <ModalBody pt="0" pb="8">
          {claimed ? (
            <Alert status="success">
              <AlertIcon />
              <Box>
                <AlertTitle position="relative" top={"2px"} mb="1">
                  Reward successfully claimed!
                </AlertTitle>
                <AlertDescription>
                  Now you can access this space as{" "}
                  <Text fontWeight={"medium"}>{emails?.emailAddress}</Text>
                </AlertDescription>
              </Box>
            </Alert>
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
          {claimed ? (
            <>
              <Button
                as="a"
                target="_blank"
                href={gatherSpaceUrl}
                onClick={onClose}
                iconSpacing={1}
                rightIcon={<ArrowSquareOut />}
                w="full"
                colorScheme="GATHER_TOWN"
              >
                Go to space
              </Button>
            </>
          ) : (
            <>
              <Button
                isDisabled={!emails?.emailAddress || isLoading}
                w="full"
                onClick={onSubmit}
                colorScheme={"GATHER_TOWN"}
                isLoading={isLoading}
              >
                Continue with email
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ClaimGatherModal
