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
  description: string | JSX.Element
  confirmationText: string
  isLoading?: boolean
  loadingText?: string | boolean
} & Omit<AlertDialogProps, "leastDestructiveRef" | "children">

const ConfirmationAlert = ({
  onClose,
  onConfirm,
  confirmationText,
  description,
  title,
  isLoading = false,
  loadingText,
  ...rest
}: Props): JSX.Element => {
  const cancelRef = useRef()

  return (
    <Alert leastDestructiveRef={cancelRef} onClose={onClose} {...rest}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader pb="5">{title}</AlertDialogHeader>
          <AlertDialogBody>{description}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              data-test="delete-confirmation-button"
              colorScheme="red"
              ml={3}
              onClick={!!onConfirm ? () => onConfirm() : () => onClose()}
              isLoading={isLoading}
              loadingText={loadingText}
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
