import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react"
import { ArrowRight } from "@phosphor-icons/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import { useRef } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSendEmbed: () => void
  onContinue: () => void
}

const SendDiscordJoinButtonAlert = ({
  isOpen,
  onClose,
  onSendEmbed,
  onContinue,
}: Props): JSX.Element => {
  const cancelRef = useRef()
  const { captureEvent } = usePostHogContext()

  return (
    <Alert
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Are you sure?</AlertDialogHeader>
          <AlertDialogBody>
            Sending a Discord join embed helps your community find their way into
            your Guild and unlock new roles.
          </AlertDialogBody>
          <AlertDialogFooter flexDirection="column">
            <Button
              colorScheme="DISCORD"
              onClick={() => {
                captureEvent(
                  "guild creation flow > onboarding finished WITH Discord embed"
                )
                onSendEmbed()
              }}
              w="full"
            >
              Send join button
            </Button>

            <Button
              rightIcon={<ArrowRight />}
              variant="link"
              color="gray"
              fontWeight="normal"
              maxW="max-content"
              mt={4}
              onClick={() => {
                captureEvent(
                  "guild creation flow > onboarding finished WITHOUT Discord embed"
                )
                onContinue()
              }}
            >
              Or continue without sending it
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </Alert>
  )
}

export default SendDiscordJoinButtonAlert
