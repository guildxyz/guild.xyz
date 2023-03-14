import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import { ArrowRight } from "phosphor-react"
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
            <Button colorScheme="DISCORD" onClick={onSendEmbed} w="full">
              Send join button
            </Button>

            <Button
              rightIcon={<ArrowRight />}
              variant="link"
              color="gray"
              fontWeight="normal"
              maxW="max-content"
              mt={4}
              onClick={onContinue}
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
