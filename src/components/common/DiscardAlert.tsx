import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react"
import { Alert } from "components/common/Modal"
import { useRef } from "react"
import { Rest } from "types"

type Props = {
  isOpen: boolean
  onDiscard: () => void
  onClose: () => void
} & Rest

const DiscardAlert = ({ isOpen, onClose, onDiscard }: Props): JSX.Element => {
  const cancelRef = useRef()

  return (
    <Alert {...{ isOpen, onClose }} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Discard changes?</AlertDialogHeader>
          <AlertDialogBody>
            There're unsaved changes that'll be lost. Do you want to proceed?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Keep editing
            </Button>
            <Button colorScheme="red" ml={3} onClick={onDiscard || onClose}>
              Discard changes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </Alert>
  )
}

export default DiscardAlert
