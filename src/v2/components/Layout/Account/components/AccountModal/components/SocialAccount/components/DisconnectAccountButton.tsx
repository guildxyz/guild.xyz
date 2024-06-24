import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Icon,
  IconButton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import { LinkBreak } from "phosphor-react"
import { useRef } from "react"
import { PathString } from "react-hook-form"

type Disclosure = ReturnType<typeof useDisclosure>

const DisconnectAccountButton = ({
  onConfirm,
  isLoading,
  loadingText,
  name,
  disclosure: { isOpen, onClose, onOpen },
}: {
  onConfirm: () => void
  isLoading: boolean
  loadingText: PathString
  disclosure: Disclosure
  name: string
}) => {
  const alertCancelRef = useRef()

  return (
    <>
      <Tooltip label="Disconnect account" placement="top" hasArrow>
        <IconButton
          rounded="full"
          variant="ghost"
          size="sm"
          icon={<Icon as={LinkBreak} />}
          colorScheme="red"
          onClick={onOpen}
          aria-label="Disconnect account"
        />
      </Tooltip>
      <Alert {...{ isOpen, onClose }} leastDestructiveRef={alertCancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{`Disconnect ${name} account`}</AlertDialogHeader>

            <AlertDialogBody>
              {`Are you sure? This account will lose every Guild gated access on ${name}.`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={alertCancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={onConfirm}
                isLoading={isLoading}
                loadingText={loadingText}
                ml={3}
              >
                Disconnect
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </Alert>
    </>
  )
}

export default DisconnectAccountButton
