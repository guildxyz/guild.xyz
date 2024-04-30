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
  onSave: (e: any) => void
} & Omit<AlertDialogProps, "leastDestructiveRef" | "children">

const ChangingGuildPinDesignAlert = ({
  onClose,
  onSave,
  ...rest
}: Props): JSX.Element => {
  const cancelRef = useRef()

  return (
    <Alert leastDestructiveRef={cancelRef} onClose={onClose} {...rest}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Edit Guild Pin design?</AlertDialogHeader>
          <AlertDialogBody>
            Changing the image, name or color of your guild will affect the
            appearance of the mintable Guild Pin too. Users who have already minted
            will see the previous version, while future minters will see the new one.
            Would you like to proceed?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="orange"
              ml={3}
              onClick={(e) => {
                onSave(e)
                onClose()
              }}
            >
              Yes, save changes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </Alert>
  )
}

export default ChangingGuildPinDesignAlert
