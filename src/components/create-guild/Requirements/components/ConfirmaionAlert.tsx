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
  onConfirm: () => void
  title: string
  description: string
  confirmationText: string
  isLoading: boolean
} & Omit<AlertDialogProps, "leastDestructiveRef" | "children">

const ConfirmationAlert = ({
  onClose,
  onConfirm,
  confirmationText,
  description,
  title,
  isLoading,
  ...rest
}: Props): JSX.Element => {
  const cancelRef = useRef()

  return (
    <Alert leastDestructiveRef={cancelRef} onClose={onClose} {...rest}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{title}</AlertDialogHeader>
          <AlertDialogBody>{description}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              data-test="delete-requirement-button"
              colorScheme="red"
              ml={3}
              onClick={onConfirm || onClose}
              isLoading={isLoading}
            >
              {confirmationText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </Alert>
  )
}

export default ConfirmationAlert
