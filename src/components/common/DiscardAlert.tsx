import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import { useRef } from "react"

type Props = {
  onDiscard: () => void
} & Omit<AlertDialogProps, "leastDestructiveRef" | "children">

const DiscardAlert = ({ onClose, onDiscard, ...rest }: Props): JSX.Element => {
  const cancelRef = useRef()

  return (
    <Alert leastDestructiveRef={cancelRef} onClose={onClose} {...rest}>
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
